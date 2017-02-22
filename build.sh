#!/bin/bash

DC="docker-compose -f docker-compose.yml -f docker-compose.jenkins.yml"

# Clear this out, so jenkins doesn't re-publish something from a previous
# build.
rm -fr coverage

set -e
echo "Building..."
$DC build web

echo "Starting..."
$DC up -d web

cleanup() {
  echo "Cleaning up..."
  $DC stop
  $DC rm -f
  rm -fr ./tmp
}
trap cleanup EXIT

mkdir tmp

set +e
EXIT_CODES=0

echo "Linting..."
$DC exec -T web npm run eslint > tmp/eslint.out
EXIT_CODES=$(($EXIT_CODES + $?))

echo "Gergiching..."
gem which gergich
cat tmp/eslint.out | sed 's/\/usr\/src\/app\///' | gergich capture eslint -

echo "Running tests..."
$DC exec -T web npm run test:coverage
EXIT_CODES=$(($EXIT_CODES + $?))

cat <<END > tmp/format_coverage.rb
  def m(type, h)
    total = h[type].to_i
    covered = h["covered#{type}"].to_i
    perc = (covered.to_f / total * 100).to_i
    "#{perc}% (#{covered}/#{total})"
  end

  str = STDIN.readline
  h = Hash[str.scan(/(\w+)="(\d+)"/)]
  puts "Code coverage:"
  puts "  Statements:   #{m('statements', h)}"
  puts "  Conditionals: #{m('conditionals', h)}"
  puts "  Methods:      #{m('methods', h)}"
  puts "  Elements:     #{m('elements', h)}"
END

if [ "$EXIT_CODES" == "0" ]; then
  echo "Copying coverage files from container $ID..."
  docker cp $($DC ps -q web):/usr/src/app/coverage ./coverage
  mv coverage/lcov-report/* coverage

  COVERAGE=$(cat coverage/clover.xml | grep metrics | head -1 | ruby tmp/format_coverage.rb)
  gergich message "$COVERAGE"

  echo "Gergich publishing..."
  gergich publish

  echo "Done!"
  exit 0
fi

echo "Failed with code $EXIT_CODES"
exit $EXIT_CODES

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

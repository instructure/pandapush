#!/bin/bash
set -e

# Parse unit test results
UNIT_TOTAL=$(jq -r '.numTotalTests // 0' unit-results.json)
UNIT_PASSED=$(jq -r '.numPassedTests // 0' unit-results.json)
UNIT_FAILED=$(jq -r '.numFailedTests // 0' unit-results.json)
UNIT_SUITES=$(jq -r '.numTotalTestSuites // 0' unit-results.json)

# Parse integration test results
INT_TOTAL=$(jq -r '.numTotalTests // 0' integration-results.json)
INT_PASSED=$(jq -r '.numPassedTests // 0' integration-results.json)
INT_FAILED=$(jq -r '.numFailedTests // 0' integration-results.json)
INT_SUITES=$(jq -r '.numTotalTestSuites // 0' integration-results.json)

# Get coverage from Docker container
docker compose exec -T web npm run test:coverage -- --coverageReporters=json-summary > /dev/null 2>&1 || true
docker compose cp web:/usr/src/app/coverage/coverage-summary.json coverage-summary.json || echo '{"total":{"lines":{"pct":0},"statements":{"pct":0},"functions":{"pct":0},"branches":{"pct":0}}}' > coverage-summary.json

# Parse coverage
COV_LINES=$(jq -r '.total.lines.pct // 0' coverage-summary.json)
COV_STATEMENTS=$(jq -r '.total.statements.pct // 0' coverage-summary.json)
COV_FUNCTIONS=$(jq -r '.total.functions.pct // 0' coverage-summary.json)
COV_BRANCHES=$(jq -r '.total.branches.pct // 0' coverage-summary.json)

# Determine overall status
if [ "$UNIT_FAILED" -eq 0 ] && [ "$INT_FAILED" -eq 0 ] && [ "$UNIT_TOTAL" -gt 0 ] && [ "$INT_TOTAL" -gt 0 ]; then
  STATUS_EMOJI="✅"
else
  STATUS_EMOJI="❌"
fi

# Generate the markdown comment
cat << EOF
## $STATUS_EMOJI Test Results

### Test Summary
| Category | Suites | Tests | Passed | Failed | Status |
|----------|--------|-------|--------|--------|--------|
| **Unit** | $UNIT_SUITES | $UNIT_TOTAL | $UNIT_PASSED | $UNIT_FAILED | $([ "$UNIT_FAILED" -eq 0 ] && echo "✅" || echo "❌") |
| **Integration** | $INT_SUITES | $INT_TOTAL | $INT_PASSED | $INT_FAILED | $([ "$INT_FAILED" -eq 0 ] && echo "✅" || echo "❌") |
| **Total** | $(($UNIT_SUITES + $INT_SUITES)) | $(($UNIT_TOTAL + $INT_TOTAL)) | $(($UNIT_PASSED + $INT_PASSED)) | $(($UNIT_FAILED + $INT_FAILED)) | $STATUS_EMOJI |

### Coverage
| Metric | Percentage |
|--------|------------|
| Lines | ${COV_LINES}% |
| Statements | ${COV_STATEMENTS}% |
| Functions | ${COV_FUNCTIONS}% |
| Branches | ${COV_BRANCHES}% |

---
*Updated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')*
EOF

# Exit with error if tests failed
if [ "$UNIT_FAILED" -gt 0 ] || [ "$INT_FAILED" -gt 0 ]; then
  exit 1
fi

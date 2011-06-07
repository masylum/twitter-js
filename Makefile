NODE = node

test:
	@$(NODE) tests/twitter_test.js

.PHONY: test

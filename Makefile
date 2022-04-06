.PHONY: *

PAGES := tesseract
build: $(PAGES)
$(PAGES):
	$(MAKE) -C $@

LINT_PAGES := $(foreach PAGE,$(PAGES),$(shell grep -e '^lint: ' $(PAGE)/Makefile --quiet && echo "lint-$(PAGE)"))
lint: $(LINT_PAGES)
$(LINT_PAGES): lint-%:
	$(MAKE) -C $* lint
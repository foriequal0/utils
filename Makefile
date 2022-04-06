PAGES := tesseract

.PHONY: $(PAGES)
$(PAGES):
	$(MAKE) -C $@
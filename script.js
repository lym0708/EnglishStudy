const searchInput = document.querySelector("#wordSearch");
const clearButton = document.querySelector("#clearSearch");

if (searchInput) {
  const sections = Array.from(document.querySelectorAll(".word-section"));

  function normalizeSearch(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\u3400-\u9fff]+/gu, "");
  }

  function fuzzyMatch(text, keyword) {
    const haystack = normalizeSearch(text);
    const needle = normalizeSearch(keyword);
    if (!needle) return true;
    if (haystack.includes(needle)) return true;

    let index = 0;
    for (const char of haystack) {
      if (char === needle[index]) index += 1;
      if (index === needle.length) return true;
    }
    return false;
  }

  function filterWords() {
    const keyword = searchInput.value.trim();

    sections.forEach((section) => {
      const words = Array.from(section.querySelectorAll(".word-grid > span"));
      let visibleCount = 0;

      words.forEach((word) => {
        const matched = fuzzyMatch(`${word.dataset.searchText || ""} ${word.textContent}`, keyword);
        word.hidden = keyword && !matched;
        if (!word.hidden) visibleCount += 1;
      });

      section.hidden = keyword && visibleCount === 0 && !fuzzyMatch(section.dataset.title || section.textContent, keyword);
    });
  }

  searchInput.addEventListener("input", filterWords);

  clearButton?.addEventListener("click", () => {
    searchInput.value = "";
    filterWords();
    searchInput.focus();
  });
}

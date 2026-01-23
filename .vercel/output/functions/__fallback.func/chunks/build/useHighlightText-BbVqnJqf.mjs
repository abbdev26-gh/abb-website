const useHighlightText = () => {
  const transform = (text) => {
    if (!text) return "";
    return text.replace(/\[(.*?)\]/g, '<span class="text-[#E60000]">$1</span>');
  };
  return {
    transform
  };
};

export { useHighlightText as u };
//# sourceMappingURL=useHighlightText-BbVqnJqf.mjs.map

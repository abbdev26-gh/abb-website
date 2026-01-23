export const useHighlightText = () => {
    const transform = (text: string) => {
        if (!text) return ''
        return text.replace(/\[(.*?)\]/g, '<span class="text-[#E60000]">$1</span>')
    }

    return {
        transform
    }
}

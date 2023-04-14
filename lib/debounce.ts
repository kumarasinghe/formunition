type Handler = (...args: unknown[]) => void;

function createDebouncer(handler: Handler, timeout = 250) {
    let timer: number;

    function debounce(...args: unknown[]) {
        clearTimeout(timer);
        timer = setTimeout(() => handler(...args), timeout);
    }

    return debounce;
}

export { createDebouncer };

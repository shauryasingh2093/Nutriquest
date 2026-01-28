// Protect localStorage from being cleared
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;

// Override setItem to log
localStorage.setItem = function (key: string, value: string) {
    console.log('📝 localStorage.setItem:', key, value.substring(0, 50));
    return originalSetItem.call(this, key, value);
};

// Override removeItem to log and prevent clearing auth data
localStorage.removeItem = function (key: string) {
    console.log('🗑️ localStorage.removeItem:', key);
    console.trace('Called from:');
    return originalRemoveItem.call(this, key);
};

// Override clear to log
localStorage.clear = function () {
    console.log('💥 localStorage.clear() called!');
    console.trace('Called from:');
    return originalClear.call(this);
};

export { };

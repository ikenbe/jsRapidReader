var dom = function(el, parent) {
    var api = { el: null }
    var qs = function(selector, parent) {
        parent = parent || document;
        return parent.querySelector(selector);
    };
    var qsa = function(selector, parent) {
        parent = parent || document;
        return parent.querySelectorAll(selector);
    };
    switch (typeof el) {
        case 'string':
            parent = parent && typeof parent === 'string' ? qs(parent) : parent;
            api.el = qs(el, parent);
            break;
        case 'object':
            if (typeof el.nodeName != 'undefined') {
                api.el = el;
            } else {
                var loop = function(value, obj) {
                    obj = obj || this;
                    for (var prop in obj) {
                        if (typeof obj[prop].el != 'undefined') {
                            obj[prop] = obj[prop].val(value);
                        } else if (typeof obj[prop] == 'object') {
                            obj[prop] = loop(value, obj[prop]);
                        }
                    }
                    delete obj.val;
                    return obj;
                }
                var res = { val: loop };
                for (var key in el) {
                    res[key] = dom.apply(this, [el[key], parent]);
                }
                return res;
            }
            break;
    }
    api.val = function(value) {
        if (!this.el) return null;
        var set = !!value;
        var useValueProperty = function(value) {
            if (set) { this.el.value = value; return api; } else { return this.el.value; }
        }
        switch (this.el.nodeName.toLowerCase()) {
            case 'input':
                var type = this.el.getAttribute('type');
                if (type == 'radio' || type == 'checkbox') {
                    var els = qsa('[name="' + this.el.getAttribute('name') + '"]', parent);
                    var values = [];
                    for (var i = 0; i < els.length; i++) {
                        if (set && els[i].checked && els[i].value !== value) {
                            els[i].removeAttribute('checked');
                        } else if (set && els[i].value === value) {
                            els[i].setAttribute('checked', 'checked');
                            els[i].checked = 'checked';
                        } else if (els[i].checked) {
                            values.push(els[i].value);
                        }
                    }
                    if (!set) { return type == 'radio' ? values[0] : values; }
                } else {
                    return useValueProperty.apply(this, [value]);
                }
                break;
            case 'textarea':
                return useValueProperty.apply(this, [value]);
                break;
            case 'select':
                if (set) {
                    var options = qsa('option', this.el);
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].getAttribute('value') === value) {
                            this.el.selectedIndex = i;
                        } else {
                            options[i].removeAttribute('selected');
                        }
                    }
                } else {
                    return this.el.value;
                }
                break;
            default:
                if (set) {
                    this.el.innerHTML = value;
                } else {
                    if (typeof this.el.textContent != 'undefined') {
                        return this.el.textContent;
                    } else if (typeof this.el.innerText != 'undefined') {
                        return typeof this.el.innerText;
                    } else {
                        return this.el.innerHTML;
                    }
                }
                break;
        }
        return set ? api : null;
    }
    return api;
}
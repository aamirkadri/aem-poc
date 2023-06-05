async function emailMsFormSubmit(payload, endpoint, configToken) {
    payload.csrfToken = await getCsrfToken(endpoint, configToken)
    const postResp = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Config-token': configToken,
        },
        body: JSON.stringify(payload),
    });
    const response = await postResp.json();
    if (postResp.status == 200) {
        alert("Email Sent Successfully");
    } else {
        alert("Something went wrong with Post");
    }
}
async function copayMsFormSubmit(payload, endpoint, configToken) {
    payload.csrfToken = await getCsrfToken(endpoint, configToken)
    const postResp = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Config-token': configToken,
        },
        body: JSON.stringify(payload),
    });
    const response = await postResp.json();
    if (postResp.status == 200) {
        alert("Copay Created Successfully");
    } else {
        alert("Something went wrong with Post");
    }
}
async function searchMsScrape(payload, endpoint, configToken) {
    // payload.csrfToken = await getCsrfToken(endpoint, configToken);
    console.log(endpoint);
    payload.branch = "main";
    payload.config_token = configToken;
    console.log(payload);
    const postResp = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    const response = await postResp.json();
    if (postResp.status == 200) {
        alert("Scraped Successfully");
    } else {
        alert("Something went wrong with Post");
    }
}
async function getCsrfToken(endpoint, configToken) {
    const getResp = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Config-token': configToken,
        },
    });
    const response = await getResp.json();
    if (getResp.status == 200) {
        return response.data.csrfToken;
    } else {
        alert('Something went wrong with Get');
        // window.location.href = window.location.href;
        return;
    }
}

function createSelect(fd) {
    const select = document.createElement('select');
    select.id = fd.Field;
    if (fd.Placeholder) {
        const ph = document.createElement('option');
        ph.textContent = fd.Placeholder;
        ph.setAttribute('selected', '');
        ph.setAttribute('disabled', '');
        select.append(ph);
    }
    fd.Options.split(',').forEach((o) => {
        const option = document.createElement('option');
        option.textContent = o.trim();
        option.value = o.trim();
        select.append(option);
    });
    if (fd.Required === 'x') {
        select.setAttribute('required', 'required');
    }
    return select;
}

function constructPayload(form) {
    const payload = {};
    [...form.elements].forEach((fe) => {
        if (fe.type === 'checkbox') {
            if (fe.checked) payload[fe.id] = fe.value;
        } else if (fe.id) {
            payload[fe.id] = fe.value;
        }
    });
    return payload;
}

async function submitForm(form) {
    const payload = constructPayload(form);
    const ms_configs_url = "https://main--mspilotsandbox--pfizer.hlx.page/Forms/ms-configs.json";
    const { pathname } = new URL(ms_configs_url);
    const resp = await fetch(pathname);
    const config = await resp.json();
    const form_name = form.getAttribute("name");
    console.log(form_name);
    let endpoint = '',
        configToken = '';
    config.data.forEach(async(dataElem) => {
        if (dataElem.Microservice == form_name) {
            endpoint = dataElem.Endpoint;
            configToken = dataElem.Token;
        }
    });
    switch (form_name) {
        case 'email':
            emailMsFormSubmit(payload, endpoint, configToken);
            break;
        case 'copay-create':
            copayMsFormSubmit(payload, endpoint, configToken);
            break;
        case 'search':
            searchMsScrape(payload, endpoint, configToken);
            break;
        default:
            alert('Invalid Form Name');
    }
}

function createButton(fd) {
    const button = document.createElement('button');
    button.textContent = fd.Label;
    button.classList.add('button');
    if (fd.Type === 'submit') {
        button.addEventListener('click', async(event) => {
            const form = button.closest('form');
            if (form.checkValidity()) {
                event.preventDefault();
                button.setAttribute('disabled', '');
                await submitForm(form);
            }
        });
    }
    return button;
}

function createHeading(fd) {
    const heading = document.createElement('h3');
    heading.textContent = fd.Label;
    return heading;
}

function createInput(fd) {
    const input = document.createElement('input');
    input.type = fd.Type;
    input.id = fd.Field;
    input.setAttribute('placeholder', fd.Placeholder);
    if (fd.Required === 'x') {
        input.setAttribute('required', 'required');
    }
    if (fd.Disabled === 'x') {
        input.setAttribute('disabled', 'disabled');
    }
    if (fd["Max Length"]) {
        input.setAttribute('maxlength', fd["Max Length"]);
    }
    if (fd["Min Length"]) {
        input.setAttribute('minlength', fd["Min Length"]);
    }
    if (fd.Pattern) {
        input.setAttribute('pattern', fd.Pattern);
    }
    if (fd.Title) {
        input.setAttribute('title', fd.Title);
    }
    return input;
}

function createTextArea(fd) {
    const input = document.createElement('textarea');
    input.id = fd.Field;
    input.setAttribute('placeholder', fd.Placeholder);
    if (fd.Required === 'x') {
        input.setAttribute('required', 'required');
    }
    if (fd.Disabled === 'x') {
        input.setAttribute('disabled', 'disabled');
    }
    if (fd["Max Length"]) {
        input.setAttribute('maxlength', fd["Max Length"]);
    }
    if (fd["Min Length"]) {
        input.setAttribute('minlength', fd["Min Length"]);
    }
    if (fd.Pattern) {
        input.setAttribute('pattern', fd.Pattern);
    }
    if (fd.Title) {
        input.setAttribute('title', fd.Title);
    }
    return input;
}

function createLabel(fd) {
    const label = document.createElement('label');
    label.setAttribute('for', fd.Field);
    label.textContent = fd.Label;
    if (fd.Required === 'x') {
        label.classList.add('required');
    }
    return label;
}


async function createForm(formURL, form_name) {
    const { pathname } = new URL(formURL);
    const resp = await fetch(pathname);
    const json = await resp.json();
    const form = document.createElement('form');
    form.name = form_name;
    const rules = [];
    json.data.forEach((fd) => {
        fd.Type = fd.Type || 'text';
        const fieldWrapper = document.createElement('div');
        const fieldId = `form-${fd.Type}-wrapper`;
        fieldWrapper.className = fieldId;
        fieldWrapper.classList.add('field-wrapper');
        switch (fd.Type) {
            case 'select':
                fieldWrapper.append(createLabel(fd));
                fieldWrapper.append(createSelect(fd));
                break;
            case 'heading':
                fieldWrapper.append(createHeading(fd));
                break;
            case 'checkbox':
                fieldWrapper.append(createInput(fd));
                fieldWrapper.append(createLabel(fd));
                break;
            case 'text-area':
                fieldWrapper.append(createLabel(fd));
                fieldWrapper.append(createTextArea(fd));
                break;
            case 'submit':
                fieldWrapper.append(createButton(fd));
                break;
            default:
                fieldWrapper.append(createLabel(fd));
                fieldWrapper.append(createInput(fd));
        }
        form.append(fieldWrapper);
    });
    return (form);
}

export default async function decorate(block) {
    const form_name = block.firstElementChild.querySelector('div').innerHTML;
    block.firstElementChild.remove();
    const form = block.querySelector('a[href$=".json"]');
    if (form) {
        form.replaceWith(await createForm(form.href, form_name));
    }
}
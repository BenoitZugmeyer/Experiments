/*
  This is a little experiment with various new Web features. The goal is to make a template engine. Test it in Firefox Nightly!
  
  Using
  * Rest parameters
  * Spread call operator
  * for .. of loops
  * Yield iterators
  * Arrow functions
  * String#contains
  * HTML <template> element
  * And template strings <3
 */

/*jshint esnext: true*/

// Escape the given string so HTML characters won't be interpreted
function escapeHTML(s) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return s.replace(/[&<>"'\/]/g, (char) => map[char]);
}

// Given a list of literals and some DOM elements, create a document
// fragment alternating literals and elements.
function insertDOM(literals, ...tokens) {
  var result = document.createDocumentFragment();
  
  literals.forEach((literal, i) => {
    result.appendChild(document.createTextNode(literal));
    var token = tokens[i];
    if (token) {
      if (token instanceof HTMLTemplateElement) {
        token = document.importNode(token.content, true);
      }
      result.appendChild(token);
    }
  });

  return result;
}

// Create an iterator to iterate over all text nodes of an element
function *iterateTextNodes(element) {
  if (element instanceof Text) {
    yield element;
  }
  else {
    for (var child of element.childNodes) {
      yield *iterateTextNodes(child);
    }
  }
}

// Given a list of literals and some stuff, create a template element
// by inserting the stuff between literals
function template(literals, ...tokens) {
  var html = '';
  var elements = [];
  
  var placeholder = '__ELEMENT_' + Math.random() + '__';
  
  // Build the initial template HTML by concatenating all strings.
  // Escape non-literal strings so it won't be interpreted.
  // Insert placeholders in the HTML where DOM elements should be
  // inserted later.
  literals.forEach((literal, i) => {
    html += literal;
    var token = tokens[i];
    if (token) {
      if (token instanceof HTMLElement) {
        html += placeholder;
        elements.push(token);
      }
      else {
        html += escapeHTML(token);
      }
    }
  });
  
  // Create the template and its content.
  var result = document.createElement('template');
  result.innerHTML = html;
  
  // Iterate over all text nodes, replacing placeholders
  // by the collected elements.
  for (var node of iterateTextNodes(result.content)) {
    if (node.textContent.contains(placeholder)) {
      var literals = node.textContent.split(placeholder);
      var fragment = insertDOM(literals,
                               ...elements.splice(0, literals.length - 1));
      node.parentNode.replaceChild(fragment, node);
    }
  }
  
  return result;
}


// Simple template
var title = template`Future is awesome`;

// Some dangerous text
var world = '<world>';

// A random DOM element
var hello = document.createElement('em');
hello.textContent = 'Hello';

// Merging all this together
var page = template`
<h1>${title}</h1>
${hello} <strong>${world}</strong>!
`;

// Display everything
document.body.appendChild(
  document.importNode(page.content, true)
);
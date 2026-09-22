/* coachinghub.ro — local-first progress for the orientation hub */
(function () {
  'use strict';
  var KEY = 'coachinghub_hub_v1';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-hub-check]'));
  var progress = document.getElementById('hubProgress');
  var text = document.getElementById('hubProgressText');
  var reset = document.getElementById('hubReset');
  if (!boxes.length || !progress || !text) return;

  function read() {
    try {
      var value = JSON.parse(localStorage.getItem(KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function isRo() { return document.documentElement.lang !== 'en'; }
  function render() {
    var state = read();
    var done = 0;
    boxes.forEach(function (box) {
      var key = box.getAttribute('data-hub-check');
      box.checked = state[key] === true;
      if (box.checked) done += 1;
    });
    progress.value = done;
    progress.setAttribute('aria-valuenow', String(done));
    text.textContent = done + ' / ' + boxes.length;
    text.parentElement.querySelector('span').textContent = isRo() ? 'repere parcurse' : 'milestones completed';
  }
  boxes.forEach(function (box) {
    box.addEventListener('change', function () {
      var state = read();
      state[box.getAttribute('data-hub-check')] = box.checked;
      save(state);
      render();
    });
  });
  if (reset) reset.addEventListener('click', function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    render();
  });
  document.addEventListener('clp:lang', render);
  render();
}());

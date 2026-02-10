(function () {
  const status = document.getElementById('status');
  const btn = document.getElementById('btnHello');
  const yearLink = document.getElementById('yearLink');

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  if (btn) {
    btn.addEventListener('click', () => {
      setStatus('JS 已运行：' + new Date().toLocaleString('zh-CN'));
      btn.textContent = '已点击（再点一次）';
    });
  }

  if (yearLink) {
    yearLink.textContent = '© ' + new Date().getFullYear();
    yearLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

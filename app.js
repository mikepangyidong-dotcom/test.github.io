(function () {
  const API_URL = 'https://api.metals.live/v1/spot/gold'; // 示例数据源，可按需替换
  const REFRESH_INTERVAL_MS = 60 * 1000; // 自动刷新间隔：60s

  const priceEl = document.getElementById('priceValue');
  const unitEl = document.getElementById('priceUnit');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const statusEl = document.getElementById('status');
  const btnRefresh = document.getElementById('btnRefresh');
  const yearLink = document.getElementById('yearLink');
  const pointCountEl = document.getElementById('pointCount');
  const ctx = document.getElementById('goldChart');

  let chart;
  const dataPoints = [];

  function setStatus(text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove('stat-status--idle', 'stat-status--ok', 'stat-status--error');
    if (type === 'ok') statusEl.classList.add('stat-status--ok');
    else if (type === 'error') statusEl.classList.add('stat-status--error');
    else statusEl.classList.add('stat-status--idle');
  }

  function formatTime(date) {
    return date.toLocaleString('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function updatePointCount() {
    if (pointCountEl) {
      pointCountEl.textContent = '数据点：' + dataPoints.length;
    }
  }

  function initChart() {
    if (!ctx) return;
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '黄金价格（USD/oz）',
            data: [],
            borderColor: 'rgba(245,196,81,0.95)',
            backgroundColor: 'rgba(245,196,81,0.18)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 6,
            },
          },
          y: {
            ticks: {
              callback: (value) => value.toFixed ? value.toFixed(2) : value,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => '价格：' + ctx.parsed.y.toFixed(2) + ' USD/oz',
            },
          },
        },
      },
    });
  }

  function appendDataPoint(price) {
    const now = new Date();
    dataPoints.push({ time: now, price });
    // 控制最多保留 240 个点（约 4 小时，1 分钟一个点）
    if (dataPoints.length > 240) dataPoints.shift();

    if (!chart) return;
    chart.data.labels = dataPoints.map((p) => p.time.toLocaleTimeString('zh-CN', { hour12: false }));
    chart.data.datasets[0].data = dataPoints.map((p) => p.price);
    chart.update('active');

    updatePointCount();
  }

  async function fetchGoldPrice() {
    setStatus('请求中…', 'idle');
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const raw = await res.json();

      // metals.live 的返回格式通常是 [[timestamp, price], ...]
      let price;
      if (Array.isArray(raw)) {
        const last = raw[raw.length - 1];
        if (Array.isArray(last) && last.length >= 2) {
          price = Number(last[1]);
        } else if (typeof last === 'number') {
          price = Number(last);
        }
      } else if (raw && typeof raw === 'object') {
        // 兼容其他 API：{ price: 2400.12 } 之类
        if (typeof raw.price === 'number') price = raw.price;
        if (raw.data && typeof raw.data.price === 'number') price = raw.data.price;
      }

      if (!price || Number.isNaN(price)) {
        throw new Error('无法从响应中解析价格');
      }

      if (priceEl) priceEl.textContent = price.toFixed(2);
      if (unitEl) unitEl.textContent = 'USD/oz';
      if (lastUpdatedEl) lastUpdatedEl.textContent = formatTime(new Date());

      appendDataPoint(price);
      setStatus('正常', 'ok');
    } catch (err) {
      console.error('获取黄金价格失败:', err);
      setStatus('获取失败，请稍后重试', 'error');
    }
  }

  function setupYearLink() {
    if (!yearLink) return;
    yearLink.textContent = '© ' + new Date().getFullYear();
    yearLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupRefreshButton() {
    if (!btnRefresh) return;
    btnRefresh.addEventListener('click', () => {
      fetchGoldPrice();
    });
  }

  function startAutoRefresh() {
    fetchGoldPrice();
    setInterval(fetchGoldPrice, REFRESH_INTERVAL_MS);
  }

  // 初始化
  if (ctx && typeof Chart !== 'undefined') {
    initChart();
  }
  setupYearLink();
  setupRefreshButton();
  startAutoRefresh();
})();

type LoadingType = 'page' | 'fullScreen';

interface IMaskLoading {
  showLoading: (type: LoadingType) => void;
  hideLoading: () => void;
}

class MaskLoading implements IMaskLoading {
  id = 'maskLoading';

  isLoading = false;

  innerHTML = {
    page: `
    <div class="page-loading">
      <div class="page-loading-spinner">
        <svg class="page-loading-circular" viewBox="25 25 50 50">
          <circle class="page-loading-path" cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
      </div>
    </div>`,
    fullScreen: `
    <div class="full-screen-loading">
      <div class="page-loading-spinner">
        <svg class="page-loading-circular" viewBox="25 25 50 50">
          <circle class="page-loading-path" cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
        <div class="page-loading-text">正在初始化</div>
      </div>
    </div>`,
  };

  showLoading(type: LoadingType) {
    if (!this.isLoading) {
      const dom = document.createElement('div');
      dom.id = this.id;
      dom.innerHTML = this.innerHTML[type];
      document.body.appendChild(dom);
      this.isLoading = true;
    }
  }

  hideLoading() {
    if (this.isLoading) {
      const dom = document.getElementById(this.id);
      dom?.parentNode?.removeChild(dom);
      this.isLoading = false;
    }
  }
}

const maskLoading = new MaskLoading();

export default maskLoading;

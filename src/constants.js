export const Themes = [{
    name: 'Supremus',
    getModule: () => import('./Themes/Supremus/Supremus.js')
}];

export const IsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
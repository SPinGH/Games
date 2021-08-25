export const Themes = [{
    name: 'Supremus',
    getModule: () => import('./Themes/Supremus/Supremus.js')
},
{
    name: 'Terminal',
    getModule: () => import('./Themes/Terminal/Terminal.js')
}];

export const IsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
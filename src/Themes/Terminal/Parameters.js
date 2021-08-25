const Parameters = {
    offsetLeft: 0,
    offsetTop: 0,
    columnCount: 0,
    rowCount: 0,
    letterWidth: 0,
    letterHeight: 0,
    fontSize: 0,
    curPos: '/',
    options: localStorage.terminalOptions ?
        JSON.parse(localStorage.terminalOptions) : {
            color: '#1eff00',
            showPos: true,
            ps: 0,
            isGlitched: true
        }
}
export default Parameters;
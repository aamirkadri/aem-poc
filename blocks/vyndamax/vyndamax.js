var isFullScreen = false;
export default async function decorate(block) {
    const anchor = block.querySelector('a');
    const src = anchor.href;
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src',src);
    let parentDiv = anchor.parentElement;
    parentDiv.style.position = 'relative';
    parentDiv.appendChild(iframe);
    anchor.remove();  
    iframe.height = 0.56 * window.innerWidth;
    let fullscreenBtn = document.createElement('button');
    fullscreenBtn.onclick = () => {
        if(isFullScreen){
            document.exitFullscreen();
        }else{
            parentDiv.requestFullscreen();
        }
        fullscreenBtn.classList.toggle('fullscreen');
        isFullScreen = !isFullScreen;
    }
    parentDiv.appendChild(fullscreenBtn);
}
// anything beyond this we don't need to render.
// As long as we factor in their size as well...
export const sightDistance = 400; 

var fog: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
window.addEventListener('resize', ()=> {
    fog.width = window.innerWidth;
    fog.height = window.innerHeight;
    UpdateFog();
});

export function UpdateFog(){
    if(!ctx){
        fog = document.getElementById("fog") as HTMLCanvasElement;
        if(!fog){ return;}
        fog.width = window.innerWidth;
        fog.height = window.innerHeight;

        ctx = fog.getContext("2d")!;
        if(!ctx){return;}
    }

    //fog.style.opacity = ".5";
    ctx.clearRect(0,0,fog.width, fog.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0,0,fog.width, fog.height);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.beginPath();
    ctx.arc(fog.width/2, fog.height/2, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
gsap.from("input",{
    y:50,
    duration:2,
    delay:0,
    stagger:0.5,
    opacity:0,
    scale:0,
    ease:"bounce.out"
    
    
});
gsap.from("#btn",{
    x:0,
    duration:2,
    opacity:0,
    rotate:360,
    ease:"elastic.out"
});
let randomx=Math.floor(Math.random()*1000);
let randomy=Math.floor(Math.random()*100);

/*gsap.from("#register",{
x:randomx,
y:randomy,
scope:0,
opacity:0,
duration:1,
color:"white"
});
    */
gsap.from('label',{
    stagger:0.1,
    opacity:0,
    scale:0,
    duration:2,
    repeat:-1
});
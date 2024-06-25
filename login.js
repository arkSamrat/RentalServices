
gsap.from('label',{
    y:0,
    stagger:0.3,
    opacity:0,
    scale:0,
    duration:1.5,
    ease:"bounce.out",
    rotate:45,
    repeat:-1
    
});
gsap.from('input',{
    y:"50%",
    stagger:0.1,
    opacity:0,
    scale:0,
    duration:1,
    ease:"elastic.out",
    
});
let tl=gsap.timeline();
tl.from("button",{
    scale:0,
    stagger:0.1,
    rotate:45,
    duration:1.5,
    ease:"bounce.out",
    yoyo:1
});
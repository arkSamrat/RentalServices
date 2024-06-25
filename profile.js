gsap.from("label",{
    y:"40%",
    stagger:0.5,
    opacity:0,
    duration:1,
    scale:0,
    ease:"bounce.out",

});
gsap.from("button",{
    scale:0,
    opacity:0,
    duratio:2,
    stagger:0.25,
    ease:"elastic.out"
})
let tl=gsap.timeline;
tl.from("input",{
    scale:0,
    opacity:0,
    duratio:2,
    stagger:0.25,
    ease:"elastic.out"
})
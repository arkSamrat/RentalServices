let tl=gsap.timeline();
 tl.to('h1',
    {
        delay:0.5,
        stagger:1,
       visibility:"hidden",
       
       repeat:-1
    }
 )

 tl.from('h1',
    {
        delay:0.5,
        stagger:1,
       visibility:"visible",
       
       repeat:-1
    }
 )
 
 tl.to('h2',{
    duration:4,
    scrambleText:{
        text:"ON RENT",
        chars:"xzxoxoxoxzz",
        revealDelay:0.5,
        speed:0.3,
        newClass:"myclass"
    }
 })
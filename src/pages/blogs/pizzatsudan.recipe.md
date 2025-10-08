---
title: Pizzatsudan Family Recipe
date: 2025-02-14
author: Skeletom
brief: My world-famous pizza dough recipe, now yours for the using!
thumb: /img/blogs/pizzatsudan/logo.png
tags: pizza,cooking,baking,pizzatsudan,food,🍕
---

---

## The Recipe

I won't bore you with some longwinded personal anecdote before getting to the recipe, like some cooking blogs. So, if YOU want to make <input type=number value=2 min=1 max=100 id="quantity"> small pizza pies, you will need...

- <span class="quantity italic highlight" id="water" initial=1.5>1.5</span> Cups of Warm Water
- <span class="quantity italic highlight" id="oil" initial=1.5>1.5</span> Tablespoons of Olive Oil
- <span class="quantity italic highlight" id="salt" initial=1.5>1.5</span> Teaspoons of Salt
- <span class="quantity italic highlight" id="flour" initial=3.33>3.33</span> Cups of Flour
- <span class="quantity italic highlight" id="sugar" initial=1.5>1.5</span> Teaspoons of Sugar
- <span class="quantity italic highlight" id="yeast" initial=1.5>1.5</span> Teaspoons of Yeast

Mix thoroughly until the contents coalesce into something identifiable as a dough, and then knead thoroughly until all lumps are smoothed out. Fold the dough inwards on itself for as long as you can. You can add more flour or water as needed, depending on if the dough is too sticky or isn't sticky enough.

Finally, divide the dough into <span class="quantity italic highlight" id="chunks" initial=2>2</span> pieces, and roll them into spheres. Lightly oil them, cover them and let them rise for <span class="italic highlight">~90</span> minutes.

---

## What is "Pizzatsudan"?

Now for the longwinded personal anecdote. <a href="https://www.youtube.com/playlist?list=PLspwi8mJZ2799Rhk-6G-fP3JQBjBFgOFT" target="_blank">Pizzatsudan</a> is a stream concept I came up with shortly after finding my footing as a streamer. It combines real-world <span class="highlight">pizza baking</span> with the <span class="highlight">Japanese "zatsudan"</span>, which pretty much means "just chatting". It's basically just a talk show with extra steps. 

Originally, I would pivot to playing a video game for the 90 minutes that I left the dough to rise, with a dough-cam and timer on the stream overlay. Eventually, though, I found that a little to hectic and just settled on shooting the breeze.


<script>
    document.getElementById("quantity").addEventListener("change", (e) => {
        console.log(e.target.value)
        for(const elem of document.getElementsByClassName("quantity")){
            elem.innerHTML = ((+elem.getAttribute("initial")) / 2.0) * e.target.value;
        }
    });
</script>
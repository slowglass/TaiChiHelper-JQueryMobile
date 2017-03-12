![Showdown][sd-logo]


## Bower

Indent here seems to be 4 chars ?

    bower install showdown

## CDN

* Indent below seems to be 8 Chars !!

        https://cdn.rawgit.com/showdownjs/showdown/<version tag>/dist/showdown.min.js

---------

# Blockquotes

You can indicate blockquotes with a >.
    
> Pardon my french


# Styling text

*This text will be italic*

**This text will be bold**

Both bold and italic can use either a `*` or an `_` around the text for styling. This allows you to combine both bold and italic if needed.

**Everyone _must_ attend the meeting at 5 o'clock today.**


# Lists

## Unordered lists

You can make an unordered list by preceding list items with either a * or a -.

* Item 1a
* Item 1b
  * Item 2
    * Item 3
      * Item 4
        * Item 5

## Ordered lists

You can make an ordered list by preceding list items with a number.

1. Item 1a
  1. Item 2
    1. Item 3
1. Item 2
1. Item 3


# Code formatting

## Inline formats

Here's an idea: why don't we take `SuperiorProject` and turn it into `**Reasonable**Project`.

## Multiple lines

This is a normal paragraph:
    
    This is a code block.

    
```
x = 0
x = 2 + 2
what is x
```


# Links

## Inline

[Showdown is great!](http://showdown.github.io/)

## Reference

Reference-style links use a second set of square brackets, inside which you place a label of your choosing to identify the link:

This is [an example][id] reference-style link.

Then, anywhere in the document (usually at the end), you define your link label like this, on a line by itself:

[id]: http://example.com/  "Optional Title Here"


# Tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| **col 3 is**  | right-aligned | $1600 |
| col 2 is      | *centered*    |   $12 |
| zebra stripes | ~~are neat~~  |    $1 |


[sd-logo]: https://raw.githubusercontent.com/showdownjs/logo/master/dist/logo.readme.png
[releases]: https://github.com/showdownjs/showdown/releases
[atx]: http://www.aaronsw.com/2002/atx/intro
[setext]: https://en.wikipedia.org/wiki/Setext

$(document).ready(function() {
  var converter = new Showdown.converter();
  var editor
  
  $(".editor").click(function(e){
    editor = this
  })
  
  $(".editor")
  .delegate(".function-button", "click", function(e){
    e.preventDefault()
  })
  .delegate(".function-bold","click", function() {
    $.markdownEditor.executeAction(editor, /([^\n]+)([\n\s]*)/g, "**$1**$2")
  })
  .delegate(".function-italic","click", function() {
    $.markdownEditor.executeAction(editor, /([^\n]+)([\n\s]*)/g, "_$1_$2")
  })
  .delegate(".function-code","click", function() {
    $.markdownEditor.executeAction(editor, /([\s\S]*)/, "`$1`")
  })
  .delegate(".function-hr","click", function() {
    $.markdownEditor.executeAction(editor, false,false, false,"\n***\n")
  })
  .delegate(".function-ul","click", function() {
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, "* $1$2", true)
  })
  .delegate(".function-ol","click", function() {
    var n = 0
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, function(str, p1, p2, offset, s) { return ++n + ". " + p1 + p2}, true)
  })
  .delegate(".function-blockquote","click", function() {
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, "> $1$2")
  })
  .delegate(".function-h1","click", function() {
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, "# $1$2", true)
  })
  .delegate(".function-h2","click", function() {
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, "## $1$2", true)
  })
  .delegate(".function-h3","click", function() {
    $.markdownEditor.executeAction(editor, /(.+)([\n]?)/g, "### $1$2", true)
  })
  $('.editor .preview').bind("click", function() {
    $.facebox(converter.makeHtml($("textarea").val()))
  })
  $('.editor-body').keyup(function() {
    var txt = $(editor).find('.editor-body').val()
    var html = converter.makeHtml(txt)
    $(editor).find(".live-preview").html(html)
  })
})

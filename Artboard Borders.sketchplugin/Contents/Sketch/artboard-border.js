 var onRun = function(context) {

  // We are passed a context variable when we're run.
  // We use this to get hold of a javascript object
  // which we can use in turn to manipulate Sketch.
  var doc = context.document;

  var selection = context.selection;
  
  if (selection.count() == 0) {
  doc.showMessage("Select an artboard");
} else {
    for (var i = 0; i < selection.count(); i++) {
      var layerType = selection[i].class();
      if (selection[i].class() == "MSArtboardGroup") {
        doc.showMessage("Hooray. You found an Artboard.");
        var artboard = selection.objectAtIndex(i);
        var artboardFrame = artboard.frame();
        var artboardWidth = artboardFrame.width();
        var artboardHeight = artboardFrame.height();
        // var artboardX = artboardFrame.x();
        // var artboardY = artboardFrame.y();
        //selection = selection.objectAtIndex(i);

        var rect = MSRectangleShape.alloc().init();
            rect.setName("Artboard Border");
            rect.frame = MSRect.rectWithRect(NSMakeRect(0,0,artboardWidth,artboardHeight));
        var shapeGroup = MSShapeGroup.shapeWithPath(rect);
        //var fill = shapeGroup.style().addStylePartOfType(0);
        //fill.color = MSImmutableColor.colorWithRed_green_blue_alpha(0.6, 0.6, 0.6, 0.0);
        var border = shapeGroup.style().addStylePartOfType(1);
            border.color = MSColor.colorWithRed_green_blue_alpha(0.8, 0.8, 0.8, 1.0);
            border.thickness = 3;
            border.position = 1;
        artboard.addLayers([shapeGroup]);
    } else {
      //var layerType = selection[i].class();
      doc.showMessage("That's not an Artboard. You selected a "+layerType+".");
    }
  }
}
};
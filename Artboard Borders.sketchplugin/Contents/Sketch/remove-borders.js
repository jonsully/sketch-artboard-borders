// This selection script has been borrowed from wonderbit's sketch-select-similar-layers plugin: https://github.com/wonderbit/sketch-select-similar-layers
 


  var selectInAllArtboards = true;
  var itemsMatched = 0;
  var debugMode = false;

  var debugLog = function(msg) {
    if (debugMode) {
      log(msg);
    }
  };

var onRun = function(context)
{ 

  var selectedLayer = context.selection.firstObject();

  // Error handling
  
  if(!selectionErrorHandling(context, true)) return;

  iterateThroughLayers(context, selectedLayer, selectIfSameLayerName);
};

//Selection Conditions

var selectIfSameLayerName = function(layer, selectedLayer)
{
  // add by Thierryc
  if([selectedLayer name].localeCompare([layer name]) == 0) {
    debugLog("* Same name ");
    [layer select:true byExtendingSelection:true];
    itemsMatched++;
  }
}

//Utility functions

var iterateThroughLayers = function(context, attr, callback)
{
  var doc = context.document;
  var page = doc.currentPage();
  var artboard = page.currentArtboard(); // if selected object is not inside of an artboard, this will be null.

  debugLog("Objects on page: " + page.layers().count());

  if(selectInAllArtboards || !artboard)
  {
    for (var j = 0; j < page.layers().count(); j++) {
      var layer = page.layers().objectAtIndex(j);

      handleObject(layer, attr, callback);
    }
  } else {
    for (var k = 0; k < artboard.layers().count(); k++) {
      var layer = artboard.layers().objectAtIndex(k);
      handleObject(layer, attr, callback);
    }
  }
  // add by Thierryc
  [doc showMessage: itemsMatched + " item" + (itemsMatched != 1 ? "s" : "") + " selected"];

}

var handleObject = function(obj, attr, fn)
{

  //debugLog("handle object: "+ [obj class]);

  // Is it a slice? ignore it
  if([obj class] == MSSliceLayer) {
    return;
  }

  // MSArtboardGroup √
  // MSShapeGroup
  // MSLayerGroup √
  // MSTextLayer
  // MSBitmapLayer
  // MSSymbolInstance

  // Is it a group?
  if([obj class] == MSLayerGroup) {

    // Call the function on the group itself
    fn.call(this, obj, attr);
    // Call the function on each of the group inside the layers
    for(var i = 0; i < obj.layers().count(); i++)
    {
      layer = obj.layers().objectAtIndex(i);
      handleObject(layer, attr, fn);
    }
    return;
  }

  // Is it a MSShapeGroup?
  if([obj class] == MSShapeGroup) {

    // Call the function on the group itself
    fn.call(this, obj, attr);
    // Call the function on each of the group inside the layers
    for(var i = 0; i < obj.layers().count(); i++)
    {
      layer = obj.layers().objectAtIndex(i);
      handleObject(layer, attr, fn);
    }
    return;
  }

  // Is it an artboard?
  if([obj class] == MSArtboardGroup) {
    // Call the function on the group itself
    fn.call(this, obj, attr);
    // Call the function on each of the group inside the layers
    for(var i = 0; i < obj.layers().count(); i++)
    {
      layer = obj.layers().objectAtIndex(i);
      handleObject(layer, attr, fn);
    }
    return;
  }

  // add by Thierryc
  // Is it an MSSymbolMaster ? for page symbol.
  if([obj class] == MSSymbolMaster) {
    // Call the function on the group itself
    fn.call(this, obj, attr);
    // Call the function on each of the group inside the layers
    for(var i = 0; i < obj.layers().count(); i++)
    {
      layer = obj.layers().objectAtIndex(i);
      handleObject(layer, attr, fn);
    }
    return;
  }

  // debugLog("handle object: "+ [obj class]);
  fn.call(this, obj, attr);
}

var selectionErrorHandling = function(context, groupsAllowed)
{
  if(context.selection.count() == 0) // Nothing selected
  {
    [[NSApplication sharedApplication] displayDialog:"You must select a layer in order to use this plugin." withTitle:"No layers selected!"];
    return false;
  }

  if(context.selection.count() > 1) // More than one layer selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with multiple layers. Please select a single layer and try again." withTitle:"Multiple layers selected!"];
    return false;
  }


  var firstObject = context.selection.firstObject();
  if([firstObject class] == MSLayerGroup && groupsAllowed == false) // Group selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with groups. Please select a layer instead." withTitle:"You've selected a group!"];
    return false;
  }

  if([firstObject class] == MSSliceLayer) // Slice selected
  {
    [[NSApplication sharedApplication] displayDialog:"This plugin doesn't work with slices. Please select a layer instead." withTitle:"You've selected a slice!"];
    return false;
  }

  return true;
}
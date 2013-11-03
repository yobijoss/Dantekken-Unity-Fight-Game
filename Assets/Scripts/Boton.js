//////////////////////////////////////////////////////////////
// Joystick.js
// Penelope iPhone Tutorial
//
// Joystick creates a movable joystick (via GUITexture) that 
// handles touch input, taps, and phases. Dead zones can control
// where the joystick input gets picked up and can be normalized.
//
// Optionally, you can enable the touchPad property from the editor
// to treat this Joystick as a TouchPad. A TouchPad allows the finger
// to touch down at any point and it tracks the movement relatively 
// without moving the graphic
//////////////////////////////////////////////////////////////

#pragma strict

@script RequireComponent( GUITexture )

// A simple class for bounding how far the GUITexture will move
//class Boundary {
//	var min : Vector2 = Vector2.zero;
//	var max : Vector2 = Vector2.zero;
//}
//
static private var joysticks : Boton[];					// A static collection of all joysticks
static private var enumeratedJoysticks : boolean = false;
static private var tapTimeDelta : float = 1;				// Time allowed between taps

//var touchPad : boolean; 									// Is this a TouchPad?
var touchZone : Rect;
var deadZone : Vector2 = Vector2.zero;						// Control when position is output
var normalize : boolean = false; 							// Normalize output after the dead-zone?
var position : Vector2; 									// [-1, 1] in x,y
var tapCount : int;											// Current tap count

var t : boolean;											//variable que nos indica si el boton esta siendo tocado

private var lastFingerId = -1;								// Finger last used for this joystick
private var tapTimeWindow : float;							// How much time there is left for a tap to occur
private var fingerDownPos : Vector2;
private var fingerDownTime : float;
private var firstDeltaTime : float = 0.5;

private var gui : GUITexture;								// Joystick graphic
private var defaultRect : Rect;								// Default position / extents of the joystick graphic
private var guiBoundary : Boundary = Boundary();			// Boundary for joystick graphic
private var guiTouchOffset : Vector2;						// Offset to apply to touch input
private var guiCenter : Vector2;							// Center of joystick

function Start()
{
	// Cache this component at startup instead of looking up every frame	
	gui = GetComponent( GUITexture );
	gui.pixelInset.width = Screen.height/6;
	gui.pixelInset.height = gui.pixelInset.width;
	// Store the default rect for the gui, so we can snap back to it
	defaultRect = gui.pixelInset;	
    
    defaultRect.x += transform.position.x * Screen.width;// + gui.pixelInset.x; // -  Screen.width * 0.5;
    defaultRect.y += transform.position.y * Screen.height;// - Screen.height * 0.5;
    
    transform.position.x = 0.0;
    transform.position.y = 0.0;
        
    t = false;
	if ( gui.texture )
		touchZone = defaultRect;

	gui.color.a = 0.25;	
	
}

function SetPos(ex : int,ye : int)
{
	gui.pixelInset.x = Screen.width - (gui.pixelInset.width + 10) * ex;
	gui.pixelInset.y = (gui.pixelInset.height + 10)*ye;
}

function Disable()
{
	gameObject.SetActive(false);
	enumeratedJoysticks = false;
}

function ResetJoystick()
{
	// Release the finger control and set the joystick back to the default position
//	 gui.pixelInset = defaultRect;
	 lastFingerId = -1;
	 position = Vector2.zero;
	 fingerDownPos = Vector2.zero;
	
	//if ( touchPad )
		gui.color.a = 0.25;	
		t = false;
}

function IsFingerDown() : boolean
{
	return (lastFingerId != -1);
}
	
function LatchedFinger( fingerId : int )
{
	// If another joystick has latched this finger, then we must release it
	if ( lastFingerId == fingerId )
		ResetJoystick();
}

function Update()
{	
	 if ( !enumeratedJoysticks )
	 {
		 // Collect all joysticks in the game, so we can relay finger latching messages
		 joysticks = FindObjectsOfType( Boton ) as Boton[];
		 enumeratedJoysticks = true;
	 }	
		
	var count = Input.touchCount;
	
	// Adjust the tap time window while it still available
	if ( tapTimeWindow > 0 )
		tapTimeWindow -= Time.deltaTime;
	else
		tapCount = 0;
	
	if ( count == 0 )
		ResetJoystick();
	else
	{
		for(var i : int = 0;i < count; i++)
		{
			var touch : Touch = Input.GetTouch(i);			
			var guiTouchPos : Vector2 = touch.position - guiTouchOffset;
	
			var shouldLatchFinger = false;
			
			if ( touchZone.Contains( touch.position ) )
				shouldLatchFinger = true;
				
			if ( gui.HitTest( touch.position ) )
			{
				shouldLatchFinger = true;
			}		
	
			// Latch the finger if this is a new touch
			if ( shouldLatchFinger && ( lastFingerId == -1 || lastFingerId != touch.fingerId ) )
			{
				t = true;

				gui.color.a = 0.75;
					
				lastFingerId = touch.fingerId;
				fingerDownPos = touch.position;
				fingerDownTime = Time.time;

				lastFingerId = touch.fingerId;
				
				// Accumulate taps if it is within the time window
				if ( tapTimeWindow > 0 )
					tapCount++;
				else
				{
					tapCount = 1;
					tapTimeWindow = tapTimeDelta;
				}
											
				// Tell other joysticks we've latched this finger
				for ( var j : Boton in joysticks )
				{
					if ( j != this )
						j.LatchedFinger( touch.fingerId );
				}						
			}				
	
			if ( lastFingerId == touch.fingerId )
			{	
				// For a touchpad, let's just set the position directly based on distance from initial touchdown
				position.x = Mathf.Clamp( ( touch.position.x - fingerDownPos.x ) / ( touchZone.width / 2 ), -1, 1 );
				position.y = Mathf.Clamp( ( touch.position.y - fingerDownPos.y ) / ( touchZone.height / 2 ), -1, 1 );
				
				if ( touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled )
					ResetJoystick();					
			}			
		}
	}
		
	// Adjust for dead zone	
	var absoluteX = Mathf.Abs( position.x );
	var absoluteY = Mathf.Abs( position.y );
	
	if ( absoluteX < deadZone.x )
	{
		// Report the joystick as being at the center if it is within the dead zone
		position.x = 0;
	}
	else if ( normalize )
	{
		// Rescale the output after taking the dead zone into account
		position.x = Mathf.Sign( position.x ) * ( absoluteX - deadZone.x ) / ( 1 - deadZone.x );
	}
		
	if ( absoluteY < deadZone.y )
	{
		// Report the joystick as being at the center if it is within the dead zone
		position.y = 0;
	}
	else if ( normalize )
	{
		// Rescale the output after taking the dead zone into account
		position.y = Mathf.Sign( position.y ) * ( absoluteY - deadZone.y ) / ( 1 - deadZone.y );
	}
}

function GettapTimeWindow() : float
{
	return tapTimeWindow;
}
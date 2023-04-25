from test import Raycaster2 as Raycaster
import math
import random
from pynput import keyboard

def main():
    
    canvasSize = "1024x768"
    
    canvasSizeX = canvasSize.split("x")[0]
    canvasSizeY = canvasSize.split("x")[1]
    
    wallBlockSize = "32x32"
    
    wallBlockSizeX = int(wallBlockSize.split("x")[0])
    wallBlockSizeY = int(wallBlockSize.split("x")[1])

    wallNumberRatioX = int(int(canvasSizeX)/int(wallBlockSizeX))
    wallNumberRatioY = int(int(canvasSizeY)/int(wallBlockSizeY))

    playerPositionX = int(canvasSizeX)/2
    playerPositionY = int(canvasSizeY)/2
    
    playerAngle = 0
    
    showXStart = 15
    showYStart = random.randint(0, 8)

    raycaster = Raycaster(playerAngle, playerPositionX, playerPositionY)
    
    blockExtentionX = 2
    blockExtentionY = 2

    wallOrder = generateWallMatrix(wallNumberRatioX, wallNumberRatioY)
    
    for j in range(showYStart, blockExtentionY + showYStart):
        for k in range(showXStart, blockExtentionX + showXStart):
            if(showXStart < playerPositionX/32 and  playerPositionX/32 < blockExtentionX + showXStart):
                wallOrder[j][k] = True
    

    raycaster.setMatrix(wallOrder)
    
    raycaster.setMatrixDimensions([wallNumberRatioX, wallNumberRatioY])
    
    rayCoordinates = raycaster.drawRays3D()    
    
    # YEquation = redrawRay(rayCoordinates, playerPositionY)
    
    
    exit = False
    
    while exit is False:
        
        printMainInfo([playerPositionX, playerPositionX/32], [playerPositionY, playerPositionY/32], playerAngle, "\n", [32*(showXStart+1), showXStart+1], [32*(showYStart+1), showYStart+1])
        printRayInfo([raycaster.playerPosition[0], raycaster.playerPosition[0]/32], [raycaster.playerPosition[1], raycaster.playerPosition[1]/32], raycaster.rayAngle, [abs(rayCoordinates[0] - playerPositionX), abs(rayCoordinates[0]/32 - playerPositionX)], [abs(rayCoordinates[1] - playerPositionY), abs(rayCoordinates[1]/32 - playerPositionY)])
        
        EstimatedRayDistance = math.sqrt(math.pow(playerPositionX + 32*(showXStart+1), 2) + math.pow(playerPositionY + 32*(showYStart+1), 2))
        calculatedRayDistance = math.sqrt(math.pow(playerPositionX + rayCoordinates[0], 2) + math.pow(playerPositionY + playerPositionY - rayCoordinates[1], 2))
        
        print(f"estimated ray distance: {EstimatedRayDistance}, {EstimatedRayDistance/32}")
        # print(f"calculated ray distance: {math.sqrt(math.pow(rayCoordinates[0], 2) + math.pow(rayCoordinates[1], 2))}")
        print(f"calculated ray distance: {calculatedRayDistance}, {calculatedRayDistance/32}")
        
        try:
            entrada = [float(input("Insert movement x: ")), float(input("Insert movement y: ")), float(input("Insert degrees: "))*math.pi/180]
            
            playerPositionX += entrada[0]
            playerPositionY += entrada[1]
            playerAngle += entrada[2]
            
            if playerAngle < 0:
                playerAngle += 2*math.pi
            elif playerAngle > 2*math.pi:
                playerAngle -= 2*math.pi
                
            raycaster.setPlayerPosition([playerPositionX, playerPositionY])
            raycaster.setRayAngle(playerAngle)
            
            rayCoordinates = raycaster.drawRays3D()
           
        except Exception as e:
            print(f"Program closed:{e}")    
            exit = True
    
    
    
    
def generateWallMatrix(wallNumberRatioX, wallNumberRatioY):

        wallOrder = []

        row = [None]* wallNumberRatioX

        for j in range(wallNumberRatioX):
            row[j] = False

        for i in range(wallNumberRatioY):
            wallOrder.append(row.copy())

        return wallOrder
    
def redrawRay(rayCoordinates, playerPositionY):
    return rayCoordinates[0] - playerPositionY

def printMainInfo(*args):
    print("Main info:")
    for element in args:
        print(f"{element}")
    print("--------------------------------")
        
def printRayInfo(*args):
    print("Ray info:")
    for element in args:
        print(f"{element}")
    print("--------------------------------")
        
if __name__ == "__main__":
    main()
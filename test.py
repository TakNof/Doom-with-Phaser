import math

class Raycaster2:
    def __init__(self, playerAngle, playerPositionX, playerPositionY):
        self.rayAngle = playerAngle - 3*math.pi/2
        self.playerPosition = [playerPositionX, playerPositionY]
        
        self.raysAmount = 1
        
    def setRayAngle(self, playerAngle):
        self.rayAngle = playerAngle
    

    def getRayAngle(self):
        return self.rayAngle
    

    def setMatrix(self, matrix):
        self.matrix = matrix    

    def getMatrix(self):
        return self.matrix
    

    def setMatrixDimensions(self, matrixDimensions):
        self.matrixDimensions = [matrixDimensions[0], matrixDimensions[1]]
    

    def getMatrixDimensions(self):
        return self.matrixDimensions
    

    def setPlayerPosition(self, playerPosition):
        self.playerPosition = playerPosition
    

    def getPlayerPosition(self):
        return self.playerPosition
                                
    def drawRays3D(self):
        rayYposition: float
        rayXposition: float

        rayYoffset: float
        rayXoffset: float

        NegInvTan = -1/math.tan(self.rayAngle)

        matrixPosition: int
        
        for i in range(1):
            
            depthOfField = 0 

            if self.rayAngle == 0 or self.rayAngle == math.pi:

                rayXposition = self.playerPosition[0]
                rayYposition = self.playerPosition[1]

                depthOfField = 8
            elif(self.rayAngle < math.pi):
                rayYposition = int((self.playerPosition[1] - 0.0001)/32)*32
                rayXposition = (self.playerPosition[1]-rayYposition) * NegInvTan + self.playerPosition[0]

                rayYoffset = -32
                rayXoffset = -rayYoffset*NegInvTan
            else:
                rayYposition = int((self.playerPosition.y + 32)/32)*32
                rayXposition = (self.playerPosition.y-rayYposition) * NegInvTan + self.playerPosition[0]

                rayYoffset = 32
                rayXoffset = -rayYoffset*NegInvTan

            ## print("Ray X position: ",rayXposition, "Ray y position: ", rayYposition,  "Ray X offset: ",rayXoffset, "Ray Y offset: ", rayYoffset)

            while(depthOfField < 8):     
                matrixPosition = [int((rayXposition + rayXoffset)/32), int((rayYposition + rayYoffset)/32)]
                
                if matrixPosition[0] * matrixPosition[1] < self.matrixDimensions[0] * self.matrixDimensions[1] and self.matrix[matrixPosition[0]][matrixPosition[1]] == True:
                    print("Wall detected")
                    depthOfField  = 8
                else:
                    rayXposition += rayXoffset
                    rayYposition += rayYoffset

                    depthOfField += 1           
            
        return [rayXposition, rayYposition]

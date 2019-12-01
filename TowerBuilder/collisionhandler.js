class CollisionHandler{
    constructor(gameScene)
    {
        gameScene.matter.world.on('collisionstart', function(event){
            let collisionPairs = event.pairs;

            for (var i = 0; i < event.pairs.length; i++){
                // this has potential issues with multiple volumes on a single body
                // other examples get the par
                //	let bodyA = this.getRootBody(collisionPairs[i].bodyA);
                //let bodyB = this.getRootBody(collisionPairs[i].bodyB);
                let bodyA = collisionPairs[i].bodyA;
                let bodyB = collisionPairs[i].bodyB;


                if(bodyA.label === 'levelChangeTrigger' && bodyB.label === 'munchkin'||
                    bodyB.label === 'levelChangeTrigger' && bodyA.label === 'munchkin')
                {
                    gameScene.completeLevel();
                }
            }
        })
    }
}


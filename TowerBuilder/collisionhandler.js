class CollisionHandler{
    constructor()
    {
        MainGameScene.matter.world.on('collisionstart', function(event){

            // every time a collision occurs go through the pairs to make sure it was not one we care about for game actions
            // this is a signiifcant downside to using matter over arcade physics
            // this would be implemented using collision callbacks if done via arcade.
            let collisionPairs = event.pairs;

            for (var i = 0; i < event.pairs.length; i++){

                let bodyA = collisionPairs[i].bodyA;
                let bodyB = collisionPairs[i].bodyB;


                if(bodyA.label === 'levelChangeTrigger' && bodyB.label === 'munchkin'||
                    bodyB.label === 'levelChangeTrigger' && bodyA.label === 'munchkin')
                {
                    // trigger level complete sequence
                    MainGameScene.completeLevel();
                }
            }
        })
    }
}


function Client(){
    this.id = 0;
}

Client.prototype.send = function(){
    // To implement by Subclass
}


Client.prototype.handle = function(){
    // TO implement by Subclass
}

Client.prototyoe,receive = function(message){
    var tp = message.tp;
    
    if(tp != 'DATA'){
        return false;
    }


    var mid = message.id;
    
    // if the message matches
    if(mid == this.id){
        this.send({
            'type': 'ACK', 
            'id': mid
        });
        
        this.id++;
        
        this.handle(message.data);
    
    // got a future thing
    } else if(mid > this.id){
        this.send({
            'type': 'EXP', 
            'id': this.id
        });
    }
    
}
        
function Server(){
    this.id = 0;
    this.cache = {};
}

Server.prototype.send = function(message){
    // To be implemmented by subclass
}

Server.prototype.handle = function(message){
    this.cache[this.id] = message;
    this.send({
        'type': 'DATA',
        'id': this.id,
        'data': message
    });
    this.id++;
}

Server.prototype.receive = function(message){
    //in case of an ACK, first check if the package is still there
    
    if(message["type"] == "ACK"){
        var mid = message["id"];
        
        // if so, delete it
        if(mid in this.cache){
            delete this.cache[mid]
        }
        
        // and try to send the next message
        if(mid+1 in this.cache){
            self.send({
                'type': 'DATA', 
                'id': mid + 1, 
                'data': self.cache[mid + 1]
            });
        }
    }
            
    // EXP -- send the message
    else if(message["type"] == "EXP"){
        var mid = message["id"];
        
        if(mid in this.cache){
            self.send({
                'type': 'DATA', 
                'id': mid, 
                'data': this.cache[mid]
            }); 
        }

    }
)            
    
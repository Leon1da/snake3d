import {
    ObstaclePart,
    Food,
    Entity,
    CubeCell,
    Obstacle,
    Particle,
    Bonus,
    LuckyBonus,
    ScoreBonus,
    FastBonus,
    InvincibilityBonus,
    InvisibilityBonus,
    SnakeNodeEntity,
    GameEntity,
    CoreObstaclePart
} from "./Entity.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { TWEEN } from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import { CoordinateManager } from "./CoordinateManager.js";
import {Snake} from "./Snake.js";
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";
import {EntityMeshManager} from "./ModelLoader.js";


// Level generator
export class EnvironmentManager {

    constructor(environment){


        this.environment = environment;
        this.snake = null;
        this.snake_nodes = [];


        this.obstacle_num = 0;
        this.core_obstacle_num = 0;
        this.food_num = 0;
        this.bonus_num = 0;
        this.snake_nodes_num = 0;

        this.coord_generator = new CoordinateManager(environment.width, environment.height, environment.depth);

        // 
        this.object_to_draw = [];
        this.object_to_move = [];
        this.object_to_destroy = [];
        this.object_to_modify = [];

        this.init_environment();
        // this.init_game();

    }


    // The following methods update the data structures

    // modifies an existing object in the environment at coordinates (x, y, z)
    modify_object_structure(x, y, z, drawable, movable, erasable, eatable){
        if(!this.check_consistency(x, y, z)) return false;

        const object = this.environment.environment[x][y][z].content;
        if( object == null ) return false;
        // if(object instanceof CoreObstaclePart) return false; // core obstacle cannot be modified
        // if(object instanceof Snake) return false; // core obstacle cannot be modified
        // if(object instanceof SnakeNodeEntity) return false; // core obstacle cannot be modified

        if(drawable !== undefined) this.environment.environment[x][y][z].content.drawable = drawable;
        if(movable !== undefined) this.environment.environment[x][y][z].content.movable = movable;
        if(erasable !== undefined) this.environment.environment[x][y][z].content.erasable = erasable;
        if(eatable !== undefined) this.environment.environment[x][y][z].content.eatable = eatable;

        this.object_to_modify.push(object); // add object to queue

        return true;

    }


    // creates an object of type (type) in the environment at coordinates (x, y, z)
    create_object_structure(x, y, z, type, drawable, movable, erasable, eatable){
        if(!this.check_consistency(x, y, z)) return null;
        if(this.environment.environment[x][y][z].content != null) return null;
        
        let object = new type(x, y, z, drawable, movable, erasable, eatable);
        this.environment.environment[x][y][z].content = object;

        if(object instanceof ObstaclePart) this.obstacle_num++;
        else if(object instanceof CoreObstaclePart) this.core_obstacle_num++;
        else if(object instanceof Food) this.food_num++;
        else if(object instanceof Bonus) this.bonus_num++;
        else if(object instanceof Snake) this.snake_nodes_num++;
        else if(object instanceof SnakeNodeEntity) this.snake_nodes_num++;

        this.object_to_draw.push(object); // add object to queue

        this.coord_generator.remove_available_coordinate(x, y, z); // update generator

        if(Config.log) console.log("Created object: [ ", type.name, " ] at [ ", x," ", y," ", z, " ]");

        return object;
    }

    // destroys the object in the environment at coordinates (x, y, z)
    destroy_object_structure(x, y, z){
        if(!this.check_consistency(x, y, z)) return false;
        const object = this.environment.environment[x][y][z].content;
        if( object == null ) return false;
        if( !object.erasable && !object.eatable) return false;


        if(object instanceof ObstaclePart) this.obstacle_num--;
        else if(object instanceof Food) this.food_num--;
        else if(object instanceof Bonus) this.bonus_num--;
        else if(object instanceof Snake) this.snake = null;
        else if(object instanceof SnakeNodeEntity) this.snake_nodes_num--;



        this.object_to_destroy.push(object); // add object to queue

        this.coord_generator.add_available_coordinate(x, y, z); // update generator

        this.environment.environment[x][y][z].content = null;

        if(Config.log) console.log("Destrojed object [ ", object.constructor.name," ] at [ ", x," ", y," ", z, " ]");

        return true;


    }

    // moves the object in the environment at coordinates [fromx, fromy, fromz] to the location at coordinates [tox, toy, toz]
    move_object_structure(from_x, from_y, from_z, to_x, to_y, to_z){
        if(!this.check_consistency(from_x, from_y, from_z)) return false;
        if(!this.check_consistency(to_x, to_y, to_z)) return false;

        const from_cell = this.environment.environment[from_x][from_y][from_z];
        if( from_cell.content == null) return false; // empty cell
        if( !from_cell.content.movable) return false; // object in cell not movable

        const to_cell = this.environment.environment[to_x][to_y][to_z];
        if( to_cell.content != null) return false; // not empty cell (target position unavailable)

        from_cell.content.update_entity_structure_position(to_x, to_y, to_z);

        to_cell.content = from_cell.content;
        from_cell.content = null;


        if (!(to_cell.content instanceof Snake) && !(to_cell.content instanceof SnakeNodeEntity))
            this.object_to_move.push(to_cell.content);


        // update generator
        this.coord_generator.remove_available_coordinate(to_x, to_y, to_z);
        this.coord_generator.add_available_coordinate(from_x, from_y, from_z);

        if(Config.log) console.log("Moved object [ ", to_cell.content.constructor.name," ] from [ ", from_x," ", from_y," ", from_z, " ] to [ ", to_x," ", to_y," ", to_z, " ]");

        return true;

    }

    destroy_snake_structure(){}
    create_snake_structure(){}
    move_snake_structure(id,new_pos) {
        const from_x = this.snake_nodes[id].x;
        const from_y = this.snake_nodes[id].y;
        const from_z = this.snake_nodes[id].z;
        const to_x = new_pos[0];
        const to_y = new_pos[1];
        const to_z = new_pos[2];

        if (Utilities.array_equal([from_x, from_y, from_z], new_pos)) return true;
        if(!this.check_consistency(to_x, to_y, to_z)) return false;

        const to_cell = this.environment.environment[to_x][to_y][to_z];
        const from_cell = this.environment.environment[from_x][from_y][from_z];

        if( from_cell.content == null) return false; // empty cell
        if( !from_cell.content.movable) return false; // object in cell not movable

        if( to_cell.content != null) {
            this.destroy_object_structure(to_x, to_y, to_z);
            this.destroy_object_view();
        }

        from_cell.content.update_entity_structure_position(to_x, to_y, to_z);
        to_cell.content = from_cell.content;
        from_cell.content = null;


        // Only for debug
        if (to_cell.content.drawable) {
            this.object_to_move.push(to_cell.content);
            this.move_object_view();
        }

        // update generator
        this.coord_generator.remove_available_coordinate(to_x, to_y, to_z);
        this.coord_generator.add_available_coordinate(from_x, from_y, from_z);


        //console.log("Moved object [ ", to_cell.content.constructor.name," ] from [ ", from_x," ", from_y," ", from_z, " ] to [ ", to_x," ", to_y," ", to_z, " ]");
        return true;
    }

    // end


    // the following methods update the graphic interface


    modify_object_view(){

        if(Config.log) console.log("Modify ", this.object_to_modify.length, " object.");
        for(let i = 0; i < this.object_to_modify.length; i++){

            const object = this.object_to_modify[i];
            if( !object.drawable ) continue;
            //    do nothing
        }

        this.object_to_modify = [];

    }
    // draw an object in the object_to_draw queue
    create_object_view(){

        if(Config.log) console.log("Drawn ", this.object_to_draw.length, " object.");
        for(let i = 0; i < this.object_to_draw.length; i++){

            const object = this.object_to_draw[i];
            if( !object.drawable ) continue;
            this.environment.mesh.add(object.mesh);


        }

        this.object_to_draw = [];

    }

    // destroy an object in the object_to_destroy queue
    destroy_object_view(){

        const environment_mesh = this.environment.mesh;

        // explosion particles
        const particles = [];
        let explosion = [];

        let j, i;
        if(Config.log) console.log("Removed ", this.object_to_destroy.length, " object.");
        for(i = 0; i < this.object_to_destroy.length; i++){

            const object = this.object_to_destroy[i];
            if( !object.erasable && !object.eatable) continue;

            explosion = this.create_object_explosion_animation(object.x, object.y, object.z);
            particles.push(explosion);

            this.environment.mesh.remove(object.mesh); // remove obstacles

            for(j = 0; j < explosion.length; j++){
                this.environment.mesh.add(explosion[j].mesh); // add particles

                // const animation = 
                const explosion_animation = new TWEEN.Tween(explosion[j].mesh.position)
                .to( { 
                    x : explosion[j].x_dir, 
                    y: explosion[j].y_dir, 
                    z: explosion[j].z_dir }, 
                    500 
                );
                const fade_animation = new TWEEN.Tween(explosion[j].mesh.material).to( { opacity: 0}, explosion[j].life );
                const dummy_animation = new TWEEN.Tween().delay(1000)
                .onComplete( 
                    function(obj){
                        for(let y = 0; y < particles.length; y++){
                            for(let w = 0; w < particles[y].length; w++){
                                    environment_mesh.remove(particles[y][w].mesh);       
                            }
                        }
                });


                explosion_animation.chain(fade_animation, dummy_animation);
                
                explosion_animation.start();



            }

        }


        this.object_to_destroy = [];
    }   

    // geneare a particles animation for a destroyed object
    create_object_explosion_animation(x, y, z){


        const w = this.environment.width;
        const h = this.environment.height;
        const d = this.environment.depth;


        const particles = [];

        // generate a number between 50 and 150
        const particles_num = Math.floor((Math.random() * 100));
        // var particles_num = 5;
        const cell_offset = 0.5;

        for(let i = 0; i < particles_num; i++){

            const x_pos = (Math.random() * cell_offset * 2) - cell_offset;
            const y_pos = (Math.random() * cell_offset * 2) - cell_offset;
            const z_pos = (Math.random() * cell_offset * 2) - cell_offset;

            let delta_movement = 0.25;
            let x_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(x_dir > 0) x_dir = "+" + String(x_dir);
            else x_dir = String(x_dir);

            let y_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(y_dir > 0) y_dir = "+" + String(y_dir);
            else y_dir = String(y_dir);

            let z_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(z_dir > 0) z_dir = "+" + String(z_dir);
            else z_dir = String(z_dir);

            const radius = Math.random() * 0.1;

            const life = Math.floor((Math.random() * 500) + 1);

            // var particle = new Particle(x + x_pos , y + y_pos, z + z_pos, radius, THREE.DodecahedronGeometry, life, x_dir, y_dir, z_dir);
            const particle = new Particle(x + x_pos, y + y_pos, z + z_pos, radius, THREE.TetrahedronGeometry, life, x_dir, y_dir, z_dir);
            // var particle = new Particle(x + x_pos , y + y_pos, z + z_pos, radius, THREE.SphereGeometry, life, x_dir, y_dir, z_dir);
            particle.mesh.position.set(
                particle.x - w/2 + cell_offset,
                particle.y - h/2 + cell_offset,
                particle.z - d/2 + cell_offset
            );

            particles.push(particle);

        }


        return particles;

    }
    
    // move an object in the object_to_move queue
    move_object_view(){

        const width = this.environment.width;
        const height = this.environment.height;
        const depth = this.environment.depth;

        if(Config.log) console.log("Moved ", this.object_to_move.length, " object.");
        for(let i = 0; i < this.object_to_move.length; i++){

            const object = this.object_to_move[i];
            if( !object.movable ) continue;


            // ANIMATION

            const tween = new TWEEN.Tween(object.mesh.position).to(
                {
                    x: object.x - width/2 + 0.5, 
                    y: object.y - height/2 + 0.5, 
                    z: object.z - depth/2 + 0.5 
                }, 
                10
            );
            

            // tween.easing(TWEEN.Easing.Quadratic.In);
            tween.start();
                                 
        }


        this.object_to_move = [];

    }

    // end



    // 

    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_consistency(x, y, z){
        const w = this.environment.width;
        const h = this.environment.height;
        const d = this.environment.depth;

        if( x >= 0 && x < w && y >= 0 && y < h && z >= 0 && z < d) return true;
        else return false;
    }

    random_movement(delta, random = false){
        if(random) delta = Math.floor(Math.random() * delta);
        
        // 6 direction 
        // forward, backward, up, down, left, right 
        const rnd_direction = Math.floor((Math.random() * 6)); // from 0 to 3
        let x, y, z;
        switch (rnd_direction) {
                
            case 0:   
                x = delta;
                y = 0;
                z = 0;
                break;
            
            case 1:  
                x = 0;
                y = delta;
                z = 0; 
                break;
            
            case 2:  
                x = 0;
                y = 0;
                z = delta; 
                break;
            
            case 3: 
                x = - delta;
                y = 0;
                z = 0;   
                break;

            case 4:  
                x = 0;
                y = - delta;
                z = 0; 
                break;
            
            case 5: 
                x = 0;
                y = 0;
                z = - delta;   
                break;
            
        }

        return {x:x, y:y, z:z};
            
    }

    random_bonus_type(){
        let type = null;
        let bonus_type_number = 3;
        let bonus_type = Math.floor((Math.random() * bonus_type_number) + 1);
        switch (bonus_type){
            case 1:
                type = LuckyBonus;
                break;
            case 2:
                type = ScoreBonus;
                break;
            case 3:
                type = InvincibilityBonus;
                break;

        }

        return type;
    }

    // randomly generates entity on the environment
    // - core obstacle are generated
    // - random obstacle are generated
    // - food is generated (always)
    // - bonus is generated (randomly)
    init_environment(){

        const space = this.environment.face_depth;

        const width = this.environment.width;
        const height = this.environment.height;
        const depth = this.environment.depth;


        // generate core obstacles
        for(let i = space; i < width - space; i++){
            for(let j = space; j < height - space; j++){
                for(let k = space; k < depth - space; k++){
                    
                    this.create_object_structure(i, j, k, CoreObstaclePart, false, false, false, false);
                   
                }
            }   
        }

        this.create_object_view();
        
    }

    create_match(game_level, spawn_obs, spawn_bonus, move_obs, move_food, move_bonus, destroy_obs, destroy_food, destroy_bonus){

        this.spawn_snake();

        if(spawn_obs){
            // obstacle
            const obstacles_num = Math.floor(Math.random() * game_level);
            this.spawn_obstacles(obstacles_num, true, move_obs, destroy_obs);

        }

        if(spawn_bonus){
            // bonus
            let bonus_num = Math.floor(Math.random() * game_level);
            bonus_num = 1;
            this.spawn_random_type_bonus(bonus_num, true, move_bonus, destroy_bonus);

        }

        let food_num = Math.floor(Math.random() * game_level);
        food_num = 1;
        this.spawn_foods(food_num, true, move_bonus, destroy_food);


        if(this.snake == null) console.log("SNAKE IS NULL", this.snake);


    }

    destroy_game(){

        this.modify_objects(Snake, undefined, undefined, true, undefined);
        this.modify_objects(SnakeNodeEntity, undefined, undefined, true, undefined);

        let unavailable_coords_list = this.coord_generator.unavailable_coordinates;
        let unavailable_coords_keys = Object.keys(unavailable_coords_list);

        for(let i = 0; i < unavailable_coords_keys.length; i++){
            let coord = unavailable_coords_list[unavailable_coords_keys[i]];
            this.destroy_object_structure(coord[0], coord[1], coord[2]);

        }

        this.destroy_object_view();


    }

    destroy_environment(){

        // this.environment.mesh


    }

    spawn_random_type_bonus(number, drawable, movable, erasable){
        for(let i = 0; i < number; i++){
            let type = this.random_bonus_type();
            this.spawn_bonus(1, type, drawable, movable, erasable, false);

        }
    }

   
    // Moves {number} object in the envirnoment
    // if { random } the number of object is in the range { 0 , number}
    move_objects(number, random){
        
        if(random) number = Math.floor(Math.random() * number);

        let from_x, from_y, from_z;
        let to_x, to_y, to_z;
        for(let i = 0; i < number; i++){

            const coord = this.coord_generator.get_random_unavailable();
            if(coord == null) continue;

            const entity = this.get_entity(coord[0], coord[1], coord[2]);
            if(entity instanceof CoreObstaclePart){
                i--;
                continue;
            }

            const relative_movement = this.random_movement(1, false);

            from_x = coord[0];
            from_y = coord[1];
            from_z = coord[2];

            to_x = from_x + relative_movement.x;
            to_y = from_y + relative_movement.y;
            to_z = from_z + relative_movement.z;

            this.move_object_structure(from_x, from_y, from_z, to_x, to_y, to_z);

        }
        
        this.move_object_view();

    }

    // Destroys {number} object in the envirnoment
    // if { random } the number of object is in the range { 0 , number}
    destroy_objects(number, random){
        if(random) number = Math.floor(Math.random() * number);

        for(let i = 0; i < number; i++){

            const coord = this.coord_generator.get_random_unavailable();
            if(coord == null) continue;
            this.destroy_object_structure(coord[0], coord[1], coord[2]);
            
        }

        this.destroy_object_view();

    }

    

    // Spawn {number} ObstaclePart object in the environment
    spawn_obstacles(number, drawable, movable, erasable, eatable, random){
        this.spawn_objects(number, ObstaclePart, drawable, movable, erasable, eatable, random);
    }


    // Spawn {number} Food object  in the environment
    spawn_foods(number, drawable, movable, erasable, random){
        this.spawn_objects(number, Food, drawable, movable, erasable, true, random);
    }


    // Spawn {number} Bonus object in the environment
    spawn_bonus(number, type, drawable, movable, erasable, random){
        this.spawn_objects(number, type, drawable, movable, erasable, true, random);
    }

    // Spawn Snake
    spawn_snake(){

        const x = Math.round(this.environment.width / 2);
        const y = Math.round(this.environment.height / 2);
        const z = this.environment.depth - 1;

        // console.log([x,y,z])
        this.snake = this.create_object_structure(x, y, z, Snake, true, true, false, false);
        this.snake_nodes.push(this.snake);
        this.create_object_view();
    }

    create_snake_node_structure(node, position){
        const node_structure = this.create_object_structure(position[0], position[1], position[2], SnakeNodeEntity, false, true, true, false);
        if (node_structure === null || node === null)
            console.log("ERROR create node structure", node_structure, node);
        if (node !== null && node.mesh !== null && node_structure!== null) {
            node_structure.mesh = node.mesh;
            node_structure.id = node.id;
            this.snake_nodes.push(node_structure);
            this.create_object_view();
        }
    }

    // Spawn {number} object of type {type} in the environment
    spawn_objects(number, type, drawable, movable, erasable, eatable, random){
        if(random) number = Math.floor(Math.random() * number);

        let spawned_object = [];

        for(let i = 0; i < number; i++){
            let coord = this.coord_generator.get_random_available();
            if(coord == null) continue;
            let obj = this.create_object_structure(coord[0], coord[1], coord[2], type, drawable, movable, erasable, eatable);
            spawned_object.push(obj);
        }

        this.create_object_view();
            
        return spawned_object;
    }

    modify_objects(type, drawable, movable, erasable, eatable){
        let modified_object = 0;
        const unavailable_coordinates = this.coord_generator._unavailable_coordinates;
        const unavailable_coordinates_keys = Object.keys(unavailable_coordinates);

        for(let i = 0; i < unavailable_coordinates_keys.length; i++){
            let key = unavailable_coordinates_keys[i];
            let coord = unavailable_coordinates[key];
            let x = coord[0], y = coord[1], z = coord[2];
            let object = this.environment.environment[x][y][z].content;


            if(object == null) continue;
            else if (object.constructor.name !== type.name) continue;
            if(this.modify_object_structure(x, y, z, drawable, movable, erasable, eatable)) modified_object++;
        }

        this.modify_object_view();

        if(Config.log) console.log("Modified object ", modified_object);
    }



    get_entity(x, y, z){
        if(this.check_consistency(x, y, z))
            return this.environment.get_cube_cell_content([x, y, z]);
        else return null;
    }
}

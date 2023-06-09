export class Config {

    static DIRECTIONS = {AXES: {X:0, Y:1, Z:2}, SIGN: {POSITIVE: 1, NEGATIVE: -1}}
    static x_positive_axis = 'X';
    static y_positive_axis = 'Y';
    static z_positive_axis = 'Z';

    static x_negative_axis = '-X';
    static y_negative_axis = '-Y';
    static z_negative_axis = '-Z';

    /*----- Game settings------*/
    static game_level = 30;


    // debugging mode
    static log = false;
    static grid_helpler = false;


    // view
    static cell_cube_dim = 1;
    static graphic_level = 3;
    static max_anisotropy = 1;


    /*----- Enviroment settings ------*/



    // environment settings
    static world_width = 10;
    static world_height = 10;
    static world_depth = 10;
    static world_face_depth = 1;

    // Objects
    static objects_speed = 2000;


    /*------ Snake settings ------*/
    static snake_speed = 300;
    static snake_nodes_distance = Config.cell_cube_dim;
    static snake_head_dimension = 0.8 * Config.snake_nodes_distance;
    static snake_nodes_dimension = 0.6 * Config.snake_nodes_distance;



    /*------ Texture packs ------*/
    static TEXTURE_PACKS = [
        {
            id: 0,
            name: "Standard",
            textures: {
                background: {name: 'background_texture', type: 'texture', path: 'models/bg.jpg'},
                invincibility: {name: 'bonus_invincibility_model', type: 'obj', path: 'models/star/star.obj'},
                lucky: {name: 'bonus_lucky_model', type: 'obj', path: 'models/lucky_leaf/lucky_leaf.obj'},
                score: {name: 'bonus_score_model', type: 'font', path: '../resources/three.js-r129/examples/fonts/droid/droid_sans_mono_regular.typeface.json'},
            },
        },
        {
            id: 1,
            name: "Pack 1",
            textures: {
                core: {name: 'core_texture_1', type: 'texture', path: 'models/mario/grass/Grass_001_COLOR.jpg'},
                snake_head: {name: 'snake_head_1', type: 'texture', path: 'models/mario/yoshi_tex.png'},
                core_norm: {name: 'core_texture_norm_1', type: 'texture', path: 'models/mario/grass/Grass_001_NORM.jpg'},
                food: {name: 'food_model_1', type: 'mtl', path: 'models/mario/power_up.mtl', obj: 'models/mario/power_up.obj'},
                obstacle: {name: 'obstacle_texture_1', type: 'texture', path: 'models/mario/wall_tex.png'},
                invincibility: {name: 'bonus_invincibility_model_1', type: 'mtl', path: 'models/mario/star.mtl', obj: 'models/mario/star.obj'},
                lucky: {name: 'bonus_lucky_model_1', type: 'mtl', path: 'models/mario/flower.mtl', obj: 'models/mario/flower.obj'},
                score: {name: 'bonus_score_model_1', type: 'mtl', path: 'models/mario/coin.mtl', obj: 'models/mario/coin.obj'},
            },
        },
    ];
    static current_texture_pack = Config.TEXTURE_PACKS[0];



    /*----- Camera settings ------*/
    // Camera
    static fov = 50;
    static aspect = 2;
    static near = 0.1;
    static far = 2000;
    static camera_speed = 500;
    static camera_radius = 15;
    static camera_offset_up = 6;
    static camera_offset_right = 6;

    // Camera Light
    static camera_light_color = 0xffffff;
    static camera_light_intensity = Config.current_texture_pack.id === 0 ? 0.8 : 1.5;
    static camera_light_position = {x: 3.0, y: 3.0, z: 0.0};

    /*------ Resource settings ------*/

    // score config
    static initial_score = 0;
    static multiplicator = 1;
    static food_score = 5;
    static bonus_score = 1;
    static obstacle_score = 10;
    static snakenode_score = 0;


    // Light
    static ambient_light_color = 0xffffff;
    static ambient_light_intensity = 0.3;

    static game_mode = "custom";
    static spawn_obs = true;
    static spawn_bonus = true;

    static movable_obs = true;
    static movable_food = true;
    static movable_bonus = true;

    static erasable_obs = true;
    static erasable_food = true;
    static erasable_bonus = true;

    // Material
    static world_color = 0x99CCFF;
    static world_opacity = 0.7;



    /*----- Game settings------*/
    // static game_level = 30;

    static username = "Guest";
    static current_level = 0;



    // match configuration
    static GAME_MODES = [
        {
            id: 0,
            name: 'Custom',
            levels: false,
            total_levels: 1,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "Level 1",
                        configuration: {

                            // env
                            world_width: 7,
                            world_height: 7,
                            world_depth: 7,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 1000,
                            texture_pack_id: 0
                        }
                    }
                ]
            }
        },
        {
            id: 1,
            name: "Regular",
            levels: true,
            total_levels: 3,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "First",
                        configuration: {

                            // env
                            world_width: 10,
                            world_height: 10,
                            world_depth: 10,
                            world_face_depth: 1,

                            // level
                            game_level: 1,

                            // entity
                            spawn_obs: false,
                            spawn_bonus: false,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 20,
                            texture_pack_id: 0
                        }
                    },
                    {
                        level: 2,
                        name: "Second",
                        configuration: {

                            // env
                            world_width: 8,
                            world_height: 8,
                            world_depth: 8,
                            world_face_depth: 1,

                            // level
                            game_level: 2,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: false,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 20,
                            texture_pack_id: 0
                        }

                    },
                    {
                        level: 3,
                        name: "Third",
                        configuration: {

                            // env
                            world_width: 5,
                            world_height: 5,
                            world_depth: 5,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 20,
                            texture_pack_id: 0
                        }

                    },
                ]
            }
        },
        {
            id: 2,
            name: "Super Mario Regular",
            levels: true,
            total_levels: 3,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "One",
                        configuration: {

                            // env
                            world_width: 10,
                            world_height: 10,
                            world_depth: 10,
                            world_face_depth: 1,

                            // level
                            game_level: 1,

                            // entity
                            spawn_obs: false,
                            spawn_bonus: false,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 10,
                            texture_pack_id: 1
                        }
                    },
                    {
                        level: 2,
                        name: "Two",
                        configuration: {

                            // env
                            world_width: 8,
                            world_height: 8,
                            world_depth: 8,
                            world_face_depth: 1,

                            // level
                            game_level: 2,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: false,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 10,
                            texture_pack_id: 1
                        }

                    },
                    {
                        level: 3,
                        name: "Three",
                        configuration: {

                            // env
                            world_width: 5,
                            world_height: 5,
                            world_depth: 5,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 10,
                            texture_pack_id: 1
                        }

                    },
                ]
            }
        },
        {
            id: 3,
            name: "Mixed Incremental",
            levels: true,
            total_levels: 6,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "Basic 5 x 5",
                        configuration: {

                            // env
                            world_width: 5,
                            world_height: 5,
                            world_depth: 5,
                            world_face_depth: 1,

                            // level
                            game_level: 2,

                            // entity
                            spawn_obs: false,
                            spawn_bonus: false,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 20,
                            texture_pack_id: 0
                        }
                    },
                    {
                        level: 2,
                        name: "Basic - Medium 7 x 7",
                        configuration: {

                            // env
                            world_width: 7,
                            world_height: 7,
                            world_depth: 7,
                            world_face_depth: 1,

                            // level
                            game_level: 2,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: false,

                            movable_obs: false,
                            movable_food: false,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 25,
                            texture_pack_id: 1
                        }

                    },
                    {
                        level: 3,
                        name: "Medium 9 x 9",
                        configuration: {

                            // env
                            world_width: 9,
                            world_height: 9,
                            world_depth: 9,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 30,
                            texture_pack_id: 0
                        }

                    },
                    {
                        level: 4,
                        name: "Medium - Hard 7 x 7",
                        configuration: {

                            // env
                            world_width: 7,
                            world_height: 7,
                            world_depth: 7,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 35,
                            texture_pack_id: 1
                        }

                    },
                    {
                        level: 5,
                        name: "Hard 5 x 5",
                        configuration: {

                            // env
                            world_width: 5,
                            world_height: 5,
                            world_depth: 5,
                            world_face_depth: 1,

                            // level
                            game_level: 15,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 40,
                            texture_pack_id: 0
                        }

                    },
                    {
                        level: 6,
                        name: "Advanced",
                        configuration: {

                            // env
                            world_width: 3,
                            world_height: 3,
                            world_depth: 3,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 50,
                            texture_pack_id: 1
                        }

                    },
                ]
            }
        }
    ];


    // static current_game_mode = Config.GAME_MODES[0]; // custom
    static current_match_configuration = Config.GAME_MODES[0]; // custom match config


    static BONUS = {
        'None' : 0,
        'ScoreBonus' : 1,
        'LuckyBonus' : 2,
        'FastBonus' : 3,
        'InvisibilityBonus' : 4,
        'InvincibilityBonus' : 5,
    }



    static actived_bonus = Config.BONUS['None'];

    static KEYBOARD = {
        "WASD" : { left: 65, up: 87, right: 68, down: 83, space: 32},
        "ARROW" : { left: 37, up: 38, right: 39, down: 40, space: 32},
    }

    static keyboard_configuration = Config.KEYBOARD['ARROW'];
}


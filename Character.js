
import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Phong_Shader, Subdivision_Sphere} = defs;

export class Character {
    constructor() {

        this.planet_r = 1;

        this.shapes = {
            character_body: new Subdivision_Sphere(4),
            character_head: new Subdivision_Sphere(4),
        }

        this.materials = {
            character: new Material(new Phong_Shader(), {
                ambient: 0.5, diffusivity: 0, specularity: 0.5,
                color: hex_color("C0C0C0"),
            })
        }

        this.forward = 0;
        this.backward = 0;
        this.right = 0;
        this.left = 0;
        this.jump = 0;

        this.x_pos = 0;
        this.y_pos = 0;
        this.z_pos = 0;

    }

    moveCharacter(t) {
        let angle = 0;
        const mov_velocity = .5;
        const mov_acceleratetion = 0.5;
        const jump_velocity = 6;
        let character_v = mov_velocity - mov_acceleratetion*t;
        const g = 2;

        if (this.forward) {
            this.z_pos = character_v * t;
        }

        if (this.backward) {
            this.z_pos = -(character_v * t);
        }

        if (this.right) {
            this.x_pos = character_v * t;
        }

        if (this.left) {
            this.x_pos = -(character_v * t);
        }

        if (this.jump) {
            const start_y = this.y_pos;
            this.y_pos = jump_velocity - (g*t);
            if (start_y === this.y_pos) {
                this.jump = !this.jump;
            }
        }

        /*                                                                      

        // Character matrices
        if (this.moveforward) {
            this.moveforward = 0;
            this.currentAngle += 0.1;
            // working on the camera stuff following the character

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
            Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)));

            //program_state.set_camera(Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                     //vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                     //vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle))));
            // this.character_model_transform = this.character_model_transform.times(Mat4.rotation(1, 0, -1, 0))
            //     .times(Mat4.translation());
            //let desired = model_transform_character.times(Mat4.translation(0, 3.2, 3.6));
            //desired = Mat4.inverse(desired);
            //program_state.set_camera(desired.map((x, i) =>
            //Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)));
            // program_state.camera_transform.
        }

        if (this.movebackward) {
            this.movebackward = 0;
            this.currentAngle -= 0.1;

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
                Vector.from(program_state.camera_inverse[i]).mix(x, 0.2)));
        }

        if(this.moveRight) {
            this.moveRight = 0;
            this.currentAngle -= 0.10; // idk have to fix this still

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
                Vector.from(program_state.camera_inverse[i]).mix(x, 0.2)));
        }

        */

        return this.convertCharacterToSpherical(this.x_pos, this.y_pos, this.z_pos);
    }

    convertCharacterToSpherical(x,y,z) {
        return {x,y,z}
    }
}
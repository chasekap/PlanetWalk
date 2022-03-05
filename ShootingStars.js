
import {defs, tiny} from './examples/common.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Cube, Phong_Shader, Subdivision_Sphere} = defs

export class ShootingStars{
    constructor() {
    this.SPAWN_RATE = 0.5 / 30
    this.PHI_VARIATION = 0
    this.THETA_VARIATION = 0.01
    this.TRAIL_RATE = 0.9
    this.PLANET_RADIUS = 1 
    this.Velocity = 0.1
    this.atmosphere_radius = 5
    this.ShootingStars = []
    this.shapes = {
         
        star: new Subdivision_Sphere(4)
    }
    this.material = new Material(new Phong_Shader, {
        ambient: 1,
        diffusivity: 0, 
        specularity: 0
    })

    }
   
    rngStars(){
       if ( Math.random() < this.SPAWN_RATE){
           const star = {
               r: this.atmosphere_radius, 
               theta: Math.random() * Math.PI * 2 , 
               phi: Math.random() * Math.PI, 
               color: Color.of(Math.max(Math.random(), 0.9), Math.max(Math.random(), 0.9),Math.max(Math.random(), 0.9),1), 
               
           }
           star.trail =  this.generateTrail(star.r,star.theta,star.phi)
           this.ShootingStars.push(star)
       }
    }
    moveStars(){
        
        this.ShootingStars = this.ShootingStars.filter(star => {return this.PLANET_RADIUS < star.r})
        .map(star => {
            return {...star, r: star.r - this.Velocity, trail: this.moveTrail(star)}
        })
    }
    moveTrail(star){
        return star.trail.map(particle => {
            const r = particle.r - this.Velocity
            const phi =  particle.phi + this.PHI_VARIATION * Math.random() - this.PHI_VARIATION * Math.random();
            const theta =  particle.theta + this.THETA_VARIATION * Math.random() - this.THETA_VARIATION * Math.random();
            return {...particle, r: r, phi: phi, theta: theta,
                x: r * Math.cos(phi) * Math.sin(theta), 
                y: r * Math.sin(phi) * Math.sin(theta), 
                z: r * Math.cos(theta) }
        })
    }
    generateTrail(r,theta,phi){
        let trail = []
        for (let i = 0; i < 100; i++){
            if (Math.random() < this.TRAIL_RATE){
                r += 0.02 * Math.random(); 
                theta += this.THETA_VARIATION * Math.random() - this.THETA_VARIATION * Math.random();
                phi += this.PHI_VARIATION * Math.random() - this.PHI_VARIATION * Math.random();
                const trail_particle = {
                r: r,
                phi: phi, 
                theta: theta, 
                x: r * Math.cos(phi) * Math.sin(theta), 
                y: r * Math.sin(phi) * Math.sin(theta), 
                z: r * Math.cos(theta), 
                color: Color.of(Math.max(Math.random(), 0.7), Math.max(Math.random(), 0.7),Math.max(Math.random(), 0.7),1),
                shape: this.shapes.star, 
                material: this.material, 
                size: 0.008, }
                trail.push(trail_particle);
            }
        }
        return trail

    }
    convertStarsToXYZShape(){
        return this.ShootingStars.map(star => {
            return {
                x: star.r * Math.cos(star.phi) * Math.sin(star.theta), 
                y: star.r * Math.sin(star.phi) * Math.sin(star.theta), 
                z: star.r * Math.cos(star.theta), 
                color: star.color,
                shape: this.shapes.star, 
                material: this.material, 
                light: true,
                size: 0.1, 
                trail: star.trail
                
            }
        })
    }
    getStars(){
        return this.convertStarsToXYZShape(); 
    }

}
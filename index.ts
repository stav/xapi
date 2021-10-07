const world1 = 'world';

export function hello(world: string = world1): string {
  return `Hello ${world}! `;
}

console.log(hello());

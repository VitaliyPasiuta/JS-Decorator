const getDecorator = () => {
  const cache = []
  return (...funcWithArgs) => {
    const existEntity = cache.find(entity => same(entity, funcWithArgs))
    if (existEntity) {
      return existEntity.promise
    } else {
      const promise = new Promise((resolve, reject) => {
        try {
          const func = funcWithArgs[0]
          const args = funcWithArgs.slice(1)
          return resolve(func(...args))
        } catch (e) {
          reject(e)
        }
      })

      const cachedEntity = [...funcWithArgs]
      cachedEntity.promise = promise
      cache.push(cachedEntity)

      return promise
    }
  }
}

async function slow(x = 0){
  return new Promise((res, rej) => {
   setTimeout(()=> res(x**x), 3000);
 })
}

const same = function(a1, a2) {
  if(a1.length !== a2.length) return false;
  for(let i= 0; i < a1.length; i++){
    if(a1[i] !== a2[i]) return false;
  }
  return true;
}
let dec = getDecorator();

async function f2(){
  console.log( await dec(slow, 1));
  console.log( await dec(slow, 2));
  console.log( await dec(slow, 1));
}
f2()



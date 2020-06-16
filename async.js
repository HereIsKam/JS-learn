



// function af1(time, cb) {
//     setTimeout(() => {
//         let data = [1, 2, 3]
//         cb(data)
//     }, time);
// }



// af1(1000, function (result) {
//     console.log(result);
// })



// function af2(time) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(() => {
//             let data = [1, 2, 3]
//             resolve(data)
//             //reject('bla-error')
//         }, time);
//     })
// }


// let promise = af2(1500);

// promise
//     .finally(function () {
//         console.log('finally');
//     })
//     .then(function (result) {
//         console.log('then', result);
//     })
//     .catch(function (error) {
//         console.log('catch', error);
//     })



function af3(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            let data = [1, 2, 3]
            resolve(data)
            //reject('bla-error')
        }, time);
    })
}


async function myFunction(time) {
    console.log('2-1');
    //start async for global
    let result = await af3(time);
    console.log('2-2',result);
    console.log('2-3');
    
}

console.log(1);
myFunction(1000);
console.log(3);

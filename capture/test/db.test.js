
import dbFactory from '../src/db.js'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chai, { expect } from 'chai'

chai.use(sinonChai);

describe('db', function () {

  let db
  let sql = { notify: async function () {} }

  beforeEach(function () {
    sinon.stub(sql, 'notify').resolves([
      { name: "Walter", age: 80 },
      { name: 'Murray', age: 68 }
    ])
    db = dbFactory(sql)
    console.log(`hi there! ${db}`)
  })

  afterEach(function() {
    sinon.restore();
  })


  it('notify', async function () {
    const res = await db.notify('futureporn/capture', { message: 'what a great test!' })
    expect(res).to.equal('taco')
    expect(sql).to.be.calledOnce
  })

  it('saveVod', async function () {
    const idk = await db.saveVod({'title': 'something'})
    expect(idk).to.equal('eeeeeeeeee')
    expect(sql).to.be.calledOnce
  })
})

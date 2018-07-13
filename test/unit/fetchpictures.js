var test = require('tape')
require('rewire-global').enable()
const fetchPictures = require('../../fetchPictures')
const splitUrlAndComment = fetchPictures.__get__('splitUrlAndComment')
const combineHtmlString = fetchPictures.__get__('combineHtmlString')

test('check if line is splitted correctly', t => {
    const msg = '\nhttp://Afdfadfdfdfadfadfdfdf    comment\n'
    t.plan(1)
    const result = splitUrlAndComment(msg)
    t.deepEqual(result, {url: 'http://Afdfadfdfdfadfadfdfdf', comment: 'comment'})
})


test('check if url with comment "Ingen bild" will get alert-danger alert instead of picture', t => {
    const msg = {url: 'http://Afdfadfdfdfadfadfdfdf.ingenting', comment: 'Ingen bild'}
    t.plan(2)
    const result = combineHtmlString(msg)
    t.ok(result)
    const expected = '<div class="card"><div class="card-body"><div aria-live="polite" role="alert" class="alert alert-danger">Ingen bild</div></div></div>'
    t.deepEqual(result, expected)
})

test('check if url with comment "Ingen bild" will get alert-danger alert instead of picture', t => {
    const msg = {url: 'http://Afdfadfdfdfadfadfdfdf.awesome', comment: 'Awesome comment about pictures'}
    t.plan(2)
    const result = combineHtmlString(msg)
    t.ok(result)
    const expected = '<div class="card"><div class="card-body"><img src="http://Afdfadfdfdfadfadfdfdf.awesome" alt="Awesome comment about pictures"></div><div class="card-body"><h4 class="card-title">Awesome comment about pictures</h4></div></div>'
    t.deepEqual(result, expected)
})
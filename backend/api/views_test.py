def test_google_maps_api_key(client):
    key = client.get('/api/gmapikey').content
    assert len(key) == 39
    assert key.isalnum()

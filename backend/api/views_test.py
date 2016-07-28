from django.core.urlresolvers import reverse

def test_google_maps_api_key(client):
    key = client.get(reverse('api:gmapikey')).content
    assert len(key) == 39
    assert key.isalnum()

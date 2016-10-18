from django.contrib import admin

from api.models import *


class StoryAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        super(StoryAdmin, self).save_model(request, obj, form, change)
        if change:
            StoryEdit(story=obj, editor=request.user.person).save()


admin.site.register(EducationLevel)
admin.site.register(MaritalStatus)
admin.site.register(Parent)
admin.site.register(Person)
admin.site.register(UrlStoryAttachment)
admin.site.register(ImageStoryAttachment)
admin.site.register(Story, StoryAdmin)

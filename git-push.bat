@echo off
cd /d "C:\Users\yas\Downloads\مشاريع ثروت\ad\yas-helpdesk"
git add -A
git commit -m "Add update notes display to tracking page

- Add section to display technician update notes in tracking page
- Render notes from ticket.notes array in tracking page
- Show author, timestamp, and note text for each update
- This allows customers to see technician updates
- Empty state shows 'لا توجد تحديثات بعد'

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com]"
git push
pause
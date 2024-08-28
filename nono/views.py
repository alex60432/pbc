from rest_framework import generics, status
from django.core.mail import send_mail
from .serializer import *
from .models import *
import time
import random
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response


class appview(generics.CreateAPIView):
    queryset = user.objects.all
    serializer_class=UserSerializer

#check if a user have a account by checking if their email is in the database
class checkEmail(APIView):
    serializer_class=CheckEmailSerializer
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            email=serializer.data.get('email')
            checkexist=user.objects.filter(email=email)
            if len(checkexist)>0:            
                return Response(True,status=status.HTTP_200_OK)
            else:
                return Response(False,status=status.HTTP_200_OK)

#get create a new user
class CreateUser(APIView):
    serializer_class=CreateUserSerializer
    def post (self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            username=serializer.data.get('username')
            password=serializer.data.get('password')
            email=serializer.data.get('email')
            checkexist=user.objects.filter(username=username)

            #check if username is already taken
            if len(checkexist)>0:            
               return Response(False,status=status.HTTP_200_OK)
            else:
                userid=len(user.objects.all())
                newuser=user (username=username,userid=userid,email=email,password=password,img='data:image/webp;base64,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')
                allpuz=puzzle.objects.filter()
                newuser.save()
                for puz in allpuz:
                    newuser.notstarted.add(puz)
                return Response(CreateUserSerializer(user).data,status=status.HTTP_201_CREATED)

#change the username
class changeusername (APIView):
    serializer_class=changeusername
    def post (self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            curuserid=request.COOKIES.get('userid', '') 
            newusername=serializer.data.get('newusername')
            checkexist=user.objects.filter(username=newusername)

            #check if username is already taken
            if len(checkexist)>0:            
                return Response(False,status=status.HTTP_200_OK)
            else:
                olduser=user.objects.filter(userid=curuserid)
                if len(olduser)>0: 
                    olduser[0].username=newusername
                    olduser[0].save(update_fields=['username'])
                response=Response(olduser[0].username,status=status.HTTP_200_OK)
                return response
            
#change the user profile pic
class changeuserimg (APIView):
    serializer_class=changeprofpic
    def post (self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            curuserid=request.COOKIES.get('userid', '') 
            newpic=serializer.data.get('img')
            changeuser=user.objects.filter(userid=curuserid)
            if len(changeuser)>0: 
                changeuser[0].img=newpic
                changeuser[0].save(update_fields=['img'])
            return Response( newpic,status=status.HTTP_200_OK)

#send a message to the user's email, this email will contain a verification code used for changing password and creating account
class sendMessage(APIView):
    serializer_class=SendEmailSerializer
    def post (self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            email=serializer.data.get('email')
            code=str(random.randrange(0,999999))
            while len(code)<6:
                code='0'+code
            send_mail(
            "your code",
            "your code is "+code,
            "\ncontact this email if you find any bug or have any suggestion",
            "setting.EMAIL_HOST_USER",
            [email],
            fail_silently=False,
            )
        return Response(code,status=status.HTTP_200_OK)

#check if the email and password is correct
class LoginChecker(APIView):
    serializer_class=LoginCheckerSerializer
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            checkexist=user.objects.filter(email=email)
            if len(checkexist)>0: 

                if checkexist[0].password!=password:
                    return Response(False,status=status.HTTP_200_OK)
                else:
                    return Response(checkexist[0].userid,status=status.HTTP_200_OK)
            else:
                return Response(False,status=status.HTTP_200_OK)
            
#get the top 20 user with the highest number of puzzles created, or the highest number of puzzles completed, or the highest score
class getinittop(APIView):
    serializer_class=gettopinit
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            rank=serializer.data.get('rank')
            alluser=user.objects.filter()
            userranked=[]

            #create a list of relevent information of all user
            for usernow in alluser:
                allcompleted=usernow.completed.all()
                allcreated=puzzle.objects.filter(createdby=usernow)

                #find total scores
                totalscore=0
                allcreated=puzzle.objects.filter(createdby=usernow)
                for x in allcreated:
                    totalscore=totalscore+x.score
                for x in allcompleted:
                    totalscore=totalscore+x.score
                userranked.append([usernow.username,usernow.img,totalscore,len(allcreated),len(allcompleted)])

            #sort the users based on rank parameter
            if rank=='Puzzle Created':
                userranked.sort(key=lambda a: a[3], reverse=True)
            elif rank=='Puzzle Solved':
                userranked.sort(key=lambda a: a[4], reverse=True)
            else:
                userranked.sort(key=lambda a: a[2], reverse=True)
            
            #assign the ranking number
            a=0
            for usercur in userranked:
                usercur.append(a)
                a=a+1
            if len(userranked)<=20:
                userranked.append('alldisplayed')
                return Response(userranked,status=status.HTTP_200_OK)
            else:
                returnranked=userranked[0:20]
                returnranked.append('updisplayed')
                return Response(returnranked,status=status.HTTP_200_OK)
            
#get the closest 20 user with the current user when it comes to the number of puzzles created, number of puzzles completed, or score
class getinituser(APIView):
    serializer_class=getuserinit
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            rank=serializer.data.get('rank')
            alluser=user.objects.filter()
            userranked=[]
            userviewingid=request.COOKIES.get('userid', '') 
            
            #create a list of relevent information of all user
            for usernow in alluser:
                allcompleted=usernow.completed.all()
                allcreated=puzzle.objects.filter(createdby=usernow)

                #find total scores
                totalscore=0
                for x in allcreated:
                    totalscore=totalscore+x.score
                for x in allcompleted:
                    totalscore=totalscore+x.score
                userranked.append([usernow.userid,usernow.username,usernow.img,totalscore,len(allcreated),len(allcompleted)])
            
            #sort the users based on rank parameter
            userlocation=0
            if rank=='Puzzle Created':
                userranked.sort(key=lambda a: a[4], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingid:
                        userlocation=i
            elif rank=='Puzzle Solved':
                userranked.sort(key=lambda a: a[5], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingid:
                        userlocation=i
            else:
                userranked.sort(key=lambda a: a[3], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingid:
                        userlocation=i

            #assign the ranking number
            a=0
            for usercur in userranked:
                usercur.append(a)
                a=a+1
                usercur.remove(usercur[0])

            #return 20 users in total
            if len(userranked)<=20:
                userranked.append('alldisplayed')
                return Response(userranked,status=status.HTTP_200_OK)
            else:
                if userlocation<9:
                    returnranked=userranked[0:20]
                    returnranked.append('updisplayed')
                    return Response(returnranked,status=status.HTTP_200_OK)
                elif len(userranked)<userlocation+11:
                    returnranked=userranked[len(userranked)-20:len(userranked)]
                    returnranked.append('downdisplayed')
                    return Response(returnranked,status=status.HTTP_200_OK)
                else:
                    returnranked=userranked[userlocation-10:userlocation+10]
                    returnranked.append('nonedisplayed')
                    return Response(returnranked,status=status.HTTP_200_OK)

#get 20 more users from that are ranked higher than the highest ranked users currently shown in the ranking section
class getmoreup(APIView):
    serializer_class=moreup
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            rank=serializer.data.get('rank')
            alluser=user.objects.filter()
            userranked=[]
            userviewingname=serializer.data.get('username')

            #create a list of relevent information of all user
            for usernow in alluser:
                allcompleted=usernow.completed.all()
                allcreated=puzzle.objects.filter(createdby=usernow)
                totalscore=0

                #find total scores
                for x in allcreated:
                    totalscore=totalscore+x.score
                for x in allcompleted:
                    totalscore=totalscore+x.score
                userranked.append([usernow.username,usernow.img,totalscore,len(allcreated),len(allcompleted)])
            
            #sort the users based on rank parameter
            userlocation=0
            if rank=='Puzzle Created':
                userranked.sort(key=lambda a: a[3], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            elif rank=='Puzzle Solved':
                userranked.sort(key=lambda a: a[4], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            else:
                userranked.sort(key=lambda a: a[2], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            
            #assign the ranking number
            a=0
            for usercur in userranked:
                usercur.append(a)
                a=a+1
            del(userranked[userlocation:])

            if len(userranked)<=20:
                userranked.append('updisplayed')
                return Response(userranked,status=status.HTTP_200_OK)
            else:
                returnranked=userranked[len(userranked)-20:len(userranked)]
                returnranked.append('nonedisplayed')
                return Response(returnranked,status=status.HTTP_200_OK)
            
#get 20 more users from that are ranked lower than the highest ranked users currently shown in the ranking section
class getmoredown(APIView):
    serializer_class=moredown
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            rank=serializer.data.get('rank')
            alluser=user.objects.filter()
            userranked=[]
            userviewingname=serializer.data.get('username')

            #create a list of relevent information of all user
            for usernow in alluser:
                allcompleted=usernow.completed.all()
                allcreated=puzzle.objects.filter(createdby=usernow)

                #find total scores
                totalscore=0
                allcreated=puzzle.objects.filter(createdby=usernow)
                for x in allcreated:
                    totalscore=totalscore+x.score
                for x in allcompleted:
                    totalscore=totalscore+x.score
                userranked.append([usernow.username,usernow.img,totalscore,len(allcreated),len(allcompleted)])

            #sort the users based on rank parameter
            userlocation=0
            if rank=='Puzzle Created':
                userranked.sort(key=lambda a: a[3], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            elif rank=='Puzzle Solved':
                userranked.sort(key=lambda a: a[4], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            else:
                userranked.sort(key=lambda a: a[2], reverse=True)
                for i in range(0,len(userranked)):
                    if userranked[i][0]==userviewingname:
                        userlocation=i
            
            #assign the ranking number
            a=0
            for usercur in userranked:
                usercur.append(a)
                a=a+1
            del(userranked[:userlocation+1])

            if len(userranked)<=20:
                userranked.append('downdisplayed')
                return Response(userranked,status=status.HTTP_200_OK)
            else:
                returnranked=userranked[userlocation+1:userlocation+21]
                returnranked.append('nonedisplayed')
                return Response(returnranked,status=status.HTTP_200_OK)

#change a account's password
class ChangePassword(APIView):
    serializer_class=PasswordChangeSerializer
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            checkexist=user.objects.filter(email=email)
            if len(checkexist)>0: 
                checkexist[0].password=password
                checkexist[0].save(update_fields=['password'])
                return Response(checkexist[0].password,status=status.HTTP_200_OK)
            else:
                return Response(False,status=status.HTTP_200_OK)

#set a cookie, the cookie should contain a user's id, remove any guestuser and transfer guest user's completed or completing puzzles on to the user
class SetUserCookies(APIView):
    serializer_class=cookieuser
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            curuserid=serializer.data.get('userid')
            guestname=request.COOKIES.get('identity', '')     

            #remove any guestuser and transfer guest user's completed or completing puzzles on to the user       
            if guestname!="" :
                curuser=user.objects.filter(userid=curuserid)
                curguest=guest.objects.filter(identity=guestname)

                if len(curuser)>0:
                    if len(curguest)>0:

                        #transfer the puzzles completed by the guest to the user
                        for puz in curguest[0].guestcompleted.all():
                            
                            ucf=curuser[0].completed.contains(puz)
                            unsf=curuser[0].notstarted.contains(puz)
                            ucif=curuser[0].completing.contains(puz)

                            if ucf==False and puz.createdby!=curuser[0]:
                                if ucif==False:
                                    puz.started=puz.started+1
                                    puz.save(update_fields=['started'])
                                curuser[0].completed.add(puz)
                                if unsf==True:
                                    curuser[0].notstarted.remove(puz)
                                if ucif==True:
                                    curuser[0].completing.remove(puz)
                                    curguestsave=savedpuzzle.objects.filter(savedof=puz).filter(savedby=curuser[0])
                                    if len(curguestsave)>0: 
                                        curguestsave[0].delete()

                        #transfer the puzzles the guest is completeing to the user if the user is not also completing the same puzzle
                        for puz in curguest[0].guestcompleting.all():
                            ucf=curuser[0].completed.all().contains(puz)
                            unsf=curuser[0].notstarted.all().contains(puz)
                            ucif=curuser[0].completing.all().contains(puz)
                            if ucf==False and ucif==False and puz.createdby!=curuser[0]:
                                puz.started=puz.started+1
                                puz.save(update_fields=['started'])
                                curuser[0].notstarted.remove(puz)
                                curuser[0].completing.add(puz)
                                curguestsave=savedpuzzle.objects.filter(savedof=puz).filter(guestsavedby=curguest[0])
                                if len(curguestsave)>0: 
                                    curguestsave[0].savedby=curuser[0]
                                    curguestsave[0].save(update_fields=['savedby'])
                            else:
                                curguestsave=savedpuzzle.objects.filter(savedof=puz).filter(guestsavedby=curguest[0])
                                if len(curguestsave)>0: 
                                    curguestsave[0].delete()
                                
            #create a cookie with user id
            curuser=user.objects.filter(userid=curuserid)
            if len(curuser)>0:
                response = Response("Cookie Set!")
                response.delete_cookie('identity')
                response.set_cookie('userid', curuserid, max_age=34000000)
                return response
    
#create a guest account
class CreateGuest(APIView):
    def post(self, request, format=None):
        identity=str(len(guest.objects.filter()))
        newguest=guest (identity=identity)
        allpuz=puzzle.objects.all()
        newguest.save()
        for puz in allpuz:
            newguest.guestnotstarted.add(puz)
        return Response(identity,status=status.HTTP_201_CREATED)
    
#set the cookie for a guest
class SetGuestCookies(APIView):
    serializer_class=cookieguest
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)     
        if serializer.is_valid():
            identity=serializer.data.get('identity')
            response = Response(identity)
            response.set_cookie('identity', identity,max_age=2600000)
            return response

#check if the user is a user or a guest
class CheckCookies(APIView):
    def post(self, request, format=None):
        userid=request.COOKIES.get('userid', '')
        guest=request.COOKIES.get('identity', '')
        if userid=='':
            if guest=='':
                returnlist='','none'
                return Response(returnlist,status=status.HTTP_200_OK)
            else:
                returnlist=guest,'guest'
                return Response(returnlist,status=status.HTTP_200_OK)
        else:
            returnlist=userid,'user'
            return Response(returnlist,status=status.HTTP_200_OK)

#get user id cookie
class getuserid(APIView):
    def get(self, request, format=None):
        userid=request.COOKIES.get('userid', '')
        if userid=="":
             userid=request.COOKIES.get('identity', '')
        return Response(userid,status=status.HTTP_200_OK)
    
#get relevent information about the user
class getuserbyid(APIView):
    serializer_class=cookieuser
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            curuserid=serializer.data.get('userid')
            userinfo=user.objects.filter(userid=curuserid)
    
            #get the first 20 puzzle the user have not completed
            rnslist=[]
            for puzzles in userinfo[0].notstarted.all():
                rnslist.append([puzzles.img,puzzles.pub_date,puzzles.name,puzzles.ans])
            returnlist=[[]]
            if len(rnslist)==0:
                returnlist[0].append('none')
            else:
                rnslist.sort(key=lambda a: a[1])
                if 20>len(rnslist):
                    returnlist[0].append(rnslist[0:len(rnslist)])
                else:
                    returnlist[0].append(rnslist[0:20])
                for i in range(len(returnlist[0][0])):
                    returnlist[0][0][i].remove(returnlist[0][0][i][1])
            returnlist[0].append(len(rnslist))

            #get user's stats about the puzzles they created, completed, and their score
            allcreated=puzzle.objects.filter(createdby=userinfo[0])
            allcomp=userinfo[0].completed.all()
            allcompname=[]
            for x in allcomp:
                allcompname.append(x.name)
            returnlist.append(allcompname)
            allctitle=[]
            for x in allcreated:
                allctitle.append(x.name)
            returnlist.append(allctitle)
            allliked=[]
            for puzzles in puzzle.objects.all():
                if userinfo[0] in puzzles.likedby.all():
                    allliked.append(puzzles.name)
            returnlist.append(allliked)
            totalscore=0
            for x in allcreated:
                totalscore=totalscore+x.score
            for x in userinfo[0].completed.all():
                totalscore=totalscore+x.score
            returnlist.insert(0,totalscore)
            returnlist.insert(0,len(allcreated))
            returnlist.insert(0,len(userinfo[0].completed.all()))

            #get user's username and profile picture
            returnlist.insert(0,userinfo[0].img)
            returnlist.insert(0,userinfo[0].username)
            return Response(returnlist,status=status.HTTP_200_OK)

#get relevent information about the guest
class getguestbyid(APIView):
    serializer_class=cookieguest
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            identity=serializer.data.get('identity')
            userinfo=guest.objects.filter(identity=identity)

            #get the first 20 puzzle the guest have not completed
            rnslist=[]
            for puzzles in userinfo[0].guestnotstarted.all():
                rnslist.append([puzzles.img,puzzles.pub_date,puzzles.name,puzzles.ans])
            returnlist=[[]]
            if len(rnslist)==0:
                returnlist[0].append('none')
            else:
                rnslist.sort(key=lambda a: a[1])
                if 20>len(rnslist):
                    returnlist[0].append(rnslist[0:len(rnslist)])
                else:
                    returnlist[0].append(rnslist[0:20])
                for i in range(len(returnlist[0][0])):
                    returnlist[0][0][i].remove(returnlist[0][0][i][1])
            returnlist[0].append(len(rnslist))

            #get guest's stats about the puzzles they created and their score
            allcomp=userinfo[0].guestcompleted.all()
            allcompname=[]
            for x in allcomp:
                allcompname.append(x.name)
            returnlist.append(allcompname)
            totalscore=0
            for x in userinfo[0].guestcompleted.all():
                totalscore=totalscore+x.score
            
            returnlist.insert(0,totalscore)
            returnlist.insert(0,len(userinfo[0].guestcompleted.all()))

            #get guest's id
            returnlist.insert(0,userinfo[0].identity)
            return Response(returnlist,status=status.HTTP_200_OK)

#save a version of the puzzle the user is creating
class savepuzzle(APIView):
    serializer_class=addnewsave
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            curuserid=request.COOKIES.get('userid', '')       
            belonguser=user.objects.filter(userid=curuserid)
            newimg=serializer.data.get('img')
            newtitle=serializer.data.get('title')
            newlocalans=serializer.data.get('localans')
            firstdate=serializer.data.get('startdate')

            #if the puzzle is not saved, add a new puzzle if the save's new name is not used by other puzzles
            if firstdate=="0":
                usersavelist=localsol.objects.filter(user=belonguser[0])
                saved=usersavelist.filter(save_first=firstdate)
                if len(saved)==0:
                    newsave=localsol( save_first =str(time.time_ns()),user=belonguser[0],img=newimg,title=newtitle,localans=newlocalans)
                    newsave.save()
                    return  Response(newsave.save_first,status=status.HTTP_201_CREATED)
                else:
                    return Response(False,status=status.HTTP_200_OK)
            
            #if the puzzle is saved, change the revelvent values in the save if the save's new name is not used by other puzzles
            else:
                usersavelist=localsol.objects.filter(user=belonguser[0])
                saved=usersavelist.filter(save_first=firstdate)
                print(firstdate)

                print(newtitle)
                print(len(usersavelist.filter(title=newtitle)))
                
                if len(saved)==0:
                    return Response("back",status=status.HTTP_200_OK)
                else:
                    if saved[0].title==newtitle and len(usersavelist.filter(title=newtitle))==1 or saved[0].title!=newtitle and len(usersavelist.filter(title=newtitle))==0:
                        saved[0].img=newimg
                        saved[0].save(update_fields=['img'])
                        saved[0].title=newtitle
                        saved[0].save(update_fields=['title'])
                        saved[0].localans=newlocalans
                        saved[0].save(update_fields=['localans'])
                        saved[0].save_date=datetime.datetime.now()
                        saved[0].save(update_fields=['save_date'])

                        return Response(saved[0].save_first,status=status.HTTP_200_OK)
                    else:
                        return Response(False,status=status.HTTP_200_OK)

#create the puzzle the user is creating
class newpuzzle(APIView):
    serializer_class=createpuzzle
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            code=len(puzzle.objects.filter())
            pub_date=datetime.datetime.now()
            curuserid=request.COOKIES.get('userid', '')       
            createdby=user.objects.filter(userid=curuserid)
            img=serializer.data.get('img')
            name=serializer.data.get('name')
            ans=serializer.data.get('ans')
            score=int(serializer.data.get('score'))
            describe=serializer.data.get('describe')
            start=serializer.data.get('startdate')
            anslist=puzzle.objects.filter(ans=ans)
            namelist=puzzle.objects.filter(name=name)
            usersavelist=localsol.objects.filter(user=createdby[0])
            saved=usersavelist.filter(save_first=start)
            print(start)
            if start!="0":
                if len(saved)==0:

                    #go back to dash if puzzle is submited already in another tab
                    return Response('back',status=status.HTTP_200_OK)

            #check for plagiarism
            if len(anslist)>0:
                return Response('redo',status=status.HTTP_200_OK)
            else:

                #check for repeated name
                if len(namelist)>0:
                    return Response('rename',status=status.HTTP_200_OK)
                else:
                    print(start)
                    if start!="0":
                        if len(saved)>0:
                            print("fir")
                            #delete any old saves of the puzzle
                            saved[0].delete()

                            #creating new puzzle
                            newpuz=puzzle(score=score, code=code, pub_date=pub_date,describe=describe, createdby=createdby[0],img=img,name=name,ans=ans)
                            newpuz.save()

                            #assigning the new puzzle to all other user's not started section
                            alluser=user.objects.filter()
                            for person in alluser:
                                if person.userid != curuserid:
                                    person.notstarted.add(newpuz)

                            return Response('created',status=status.HTTP_201_CREATED)
                    else:   
                        print("sec")

                        #creating new puzzle
                        newpuz=puzzle(score=score, code=code, pub_date=pub_date,describe=describe, createdby=createdby[0],img=img,name=name,ans=ans)
                        newpuz.save()

                        #assigning the new puzzle to all other user's not started section
                        alluser=user.objects.filter()
                        for person in alluser:
                            if person.userid != curuserid:
                                person.notstarted.add(newpuz)

                        return Response('created',status=status.HTTP_201_CREATED)

#get relevent information about the puzzle
class getpuzbyname (APIView):
    serializer_class=getpuzbyname
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            name=serializer.data.get('name')
            puz=puzzle.objects.filter(name=name)
            curuserid=request.COOKIES.get('userid', '')
            guestname=request.COOKIES.get('identity', '')

            # if a user is solving the puzzle, get all relevent information about the puzzle, increment the started counter on the puzzle, and add a new (empty) save of the puzzle
            if curuserid!="":
                curuser=user.objects.filter(userid=curuserid)
                if len(puz)>0 :
                    if len(curuser)>0:
                        if puz[0] not in curuser[0].notstarted.all() and puz[0] not in curuser[0].completing.all():
                            return Response('back',status=status.HTTP_200_OK)
                        else:
                            allusersave=savedpuzzle.objects.filter(savedby=curuser[0])
                            puzsave=allusersave.filter(savedof=puz[0])
                            if len(puzsave)==0:
                                puz[0].started=puz[0].started+1
                                puz[0].save(update_fields=['started'])
                                progempty=puz[0].ans
                                while progempty.find('#')!=-1:
                                    progempty=progempty[:progempty.find('#')]+progempty[progempty.find('#')+7:]
                                if len(curuser)>0:
                                    curuser[0].notstarted.remove(puz[0])
                                    curuser[0].completing.add(puz[0])
                                newpuz=savedpuzzle(save_date=datetime.datetime.now(),progress=progempty,savedby=curuser[0],savedof=puz[0])
                                newpuz.save()
                                returnlist=[puz[0].ans,progempty]
                                return Response(returnlist,status=status.HTTP_201_CREATED)
                            else:
                                returnlist=[puz[0].ans,puzsave[0].progress]
                                return Response(returnlist,status=status.HTTP_200_OK)
            
            # if a guest is solving the puzzle, get all relevent information about the puzzle, don't increment the started counter on the puzzle, and add a new (empty) save of the puzzle
            else:
                curguest=guest.objects.filter(identity=guestname)
                if len(puz)>0 :
                    if len(curguest)>0:
                        if puz[0] not in curguest[0].guestnotstarted.all() and puz[0] not in curguest[0].guestcompleting.all():
                            return Response('back',status=status.HTTP_200_OK)
                        else:
                            allguestsave=savedpuzzle.objects.filter(guestsavedby=curguest[0])
                            puzsave=allguestsave.filter(savedof=puz[0])
                            if len(puzsave)==0:
                                progempty=puz[0].ans
                                while progempty.find('#')!=-1:
                                    progempty=progempty[:progempty.find('#')]+progempty[progempty.find('#')+7:]
                                if len(curguest)>0:
                                    curguest[0].guestnotstarted.remove(puz[0])
                                    curguest[0].guestcompleting.add(puz[0])
                                newpuz=savedpuzzle(save_date=datetime.datetime.now(),progress=progempty,guestsavedby=curguest[0],savedof=puz[0])
                                newpuz.save()
                                returnlist=[puz[0].ans,progempty]
                                return Response(returnlist,status=status.HTTP_201_CREATED)
                            else:
                                returnlist=[puz[0].ans,puzsave[0].progress]
                                return Response(returnlist,status=status.HTTP_200_OK)

#save user progress of a puzzle
class savelocalpuz(APIView):
    serializer_class=updateprogress
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            newprogress=serializer.data.get('progress')
            puzname=serializer.data.get('name')
            puz=puzzle.objects.filter(name=puzname)
            curuserid=request.COOKIES.get('userid', '')
            guestid=request.COOKIES.get('identity', '')

            #if a user is saving, change the relevent values of the puzzle and mark the saved local copy of the puzzle as being saved by the user
            if curuserid!="":
                curuser=user.objects.filter(userid=curuserid)
                if len(curuser)>0:
                    if len(puz)>0:

                        #if the puzzle is completed by the user in another tab, do not save the submission again
                        if puz[0] in curuser[0].completed.all():
                            return Response('comp',status=status.HTTP_200_OK)
                        
                        allusersave=savedpuzzle.objects.filter(savedby=curuser[0])
                        puzsave=allusersave.filter(savedof=puz[0])
                        if len(puzsave)>0:
                            puzsave[0].progress=newprogress
                            puzsave[0].save(update_fields=['progress'])
                            puzsave[0].save_date=datetime.datetime.now()
                            puzsave[0].save(update_fields=['save_date'])
                            return Response(puzsave[0].progress,status=status.HTTP_200_OK)

            #if a guest is saving, change the relevent values of the puzzle and mark the saved local copy of the puzzle as being saved by the guest
            else:
                curguest=guest.objects.filter(identity=guestid)
                if len(curguest)>0:
                    if len(puz)>0:

                        #if the puzzle is completed by the guest in another tab, do not save the submission again
                        if puz[0] in curguest[0].guestcompleted.all():
                            return Response("comp",status=status.HTTP_200_OK)
                        
                        allguestsave=savedpuzzle.objects.filter(guestsavedby=curguest[0])
                        puzsave=allguestsave.filter(savedof=puz[0])
                        if len(puzsave)>0:
                            puzsave[0].progress=newprogress
                            puzsave[0].save(update_fields=['progress'])
                            puzsave[0].save_date=datetime.datetime.now()
                            puzsave[0].save(update_fields=['save_date'])
                            return Response(puzsave[0].progress,status=status.HTTP_200_OK)

#complete a puzzle
class puzzlesolved(APIView):
    serializer_class=puzzledone
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            puzname=serializer.data.get('name')
            puz=puzzle.objects.filter(name=puzname)
            curuserid=request.COOKIES.get('userid', '')
            guestname=request.COOKIES.get('identity', '')

            #if a user has completed a puzzle, remove the saved local copy of the puzzle, mark the puzzle as completed by the user
            if curuserid!= "":
                curuser=user.objects.filter(userid=curuserid)
                if len(curuser)>0:
                    if len(puz)>0:

                        #if the puzzle is completed by the user in another tab, do not save the submission again
                        if puz[0] in curuser[0].completed.all():
                            return Response('comp',status=status.HTTP_200_OK)
                        
                        else:
                            curuser[0].completing.remove(puz[0])
                            curuser[0].completed.add(puz[0])
                            allusersave=savedpuzzle.objects.filter(savedby=curuser[0])
                            puzsave=allusersave.filter(savedof=puz[0])
                            if len(puzsave)>0:
                                puzsave[0].delete()
                            return Response('ok',status=status.HTTP_200_OK)
                    
            #if a guest has completed a puzzle, remove the saved local copy of the puzzle, mark the puzzle as completed by the guest
            else:
                curguest=guest.objects.filter(identity=guestname)
                if len(curguest)>0:
                    if len(puz)>0:

                        #if the puzzle is completed by the guest in another tab, do not save the submission again
                        if puz[0] in curguest[0].guestcompleted.all():
                            return Response('comp',status=status.HTTP_200_OK)
                        else:
                            curguest[0].guestcompleting.remove(puz[0])
                            curguest[0].guestcompleted.add(puz[0])
                            allguestsave=savedpuzzle.objects.filter(guestsavedby=curguest[0])
                            puzsave=allguestsave.filter(savedof=puz[0])
                            if len(puzsave)>0:
                                puzsave[0].delete()
                            return Response('ok',status=status.HTTP_200_OK)

#get the puzzle to display in user or guest's dashboard page
class getuserfilpuzzlenewpage(APIView):
    serializer_class=getnewpagesearch
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            search=serializer.data.get('search')
            type=serializer.data.get('type')
            page=serializer.data.get('page')
            sort=serializer.data.get('sort')
            returnlist=[]
            templist=[]
            if request.COOKIES.get('userid', '')!="":
                curuserid=request.COOKIES.get('userid', '')
                userinfo=user.objects.filter(userid=curuserid)

                #create a list of puzzles based on what type of puzzles (levels of completion and whether the user have liked it) is being rquested by the user
                if type==0:
                    for puzzles in userinfo[0].notstarted.all():
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                elif type==1:
                    for puzzles in userinfo[0].completing.all():
                        curpuz=savedpuzzle.objects.filter(savedby=userinfo[0]).filter(savedof=puzzles)
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans,curpuz[0].save_date])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans,curpuz[0].save_date])
                elif type==2:
                    for puzzles in userinfo[0].completed.all():
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                elif type==3:
                    allsave=localsol.objects.filter(user=userinfo[0])
                    for puzzles in allsave:
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.title.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.save_date,puzzles.title,puzzles.localans,puzzles.save_first])
                        else:
                            templist.append([puzzles.img,puzzles.save_date,puzzles.title,puzzles.localans,puzzles.save_first])
                elif type==4:
                    allcreated=puzzle.objects.filter(createdby=userinfo[0])
                    for puzzles in allcreated:
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                elif type==5:
                    for puzzles in puzzle.objects.all():
                        if userinfo[0] in puzzles.likedby.all():
                            if search!=None:
                                if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                    templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                            else:
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])                
            
            #create a list of puzzles based on what type of puzzles (levels of completion and whether the user have liked it) is being rquested by the guest
            else:
                guestid=request.COOKIES.get('identity', '')
                userinfo=guest.objects.filter(identity=guestid)
                if type==0:
                    for puzzles in userinfo[0].guestnotstarted.all():
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                elif type==1:
                    for puzzles in userinfo[0].guestcompleting.all():
                        curpuz=savedpuzzle.objects.filter(guestsavedby=userinfo[0]).filter(savedof=puzzles)
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans,curpuz[0].save_date])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans,curpuz[0].save_date])
                elif type==2:
                    for puzzles in userinfo[0].guestcompleted.all():
                        if search!=None:
                            if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                                templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
                        else:
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.describe,puzzles.createdby.username,puzzles.createdby.img,puzzles.ans])
            
            # habdle page in case user solved / created more puzzle in another window
            while page!=0 and page*20>=len(templist):
                page=page-1
            
            #sort based on the sort parameter and the list of puzzle created in the last step and output the result
            if sort==0:
                templist.sort(key=lambda a: a[1])
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==1:
                templist.sort(key=lambda a: a[3])
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==2:
                templist.sort(key=lambda a: a[4])
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==3:
                templist.sort(key=lambda a: a[2])
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==4:
                templist.sort(key=lambda a: a[10])
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==5:
                templist.sort(key=lambda a: a[1],reverse=True)
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==6:
                templist.sort(key=lambda a: a[3],reverse=True)
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==7:
                templist.sort(key=lambda a: a[4],reverse=True)
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==8:
                templist.sort(key=lambda a: a[2],reverse=True)
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            elif sort==9:
                templist.sort(key=lambda a: a[10],reverse=True)
                if page*20+20>len(templist):
                    returnlist.append(templist[page*20:len(templist)])
                else:
                    returnlist.append(templist[page*20:page*20+20])
                returnlist.append(len(templist))
            
            if returnlist[1]==0:
                return Response(False,status=status.HTTP_200_OK)
            else:
                for i in range (len(returnlist[0])):
                    if type==0:
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                    elif type==1:
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][3])
                    elif type==2:
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                    elif type==3:
                        returnlist[0][i].remove(returnlist[0][i][1])
                    elif type==4:
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                    elif type==5:
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][1])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][2])
                return Response(returnlist,status=status.HTTP_200_OK)

#handle liking a puzzle
class like(APIView):
    serializer_class=like
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            puzname=serializer.data.get('name')
            puz=puzzle.objects.filter(name=puzname)
            curuserid=request.COOKIES.get('userid', '')
            curuser=user.objects.filter(userid=curuserid)
            if len(puz)>0:
                if len(curuser)>0:

                    #if the user have already like the puzzle, unlike it, decrease the puzzle's like count
                    if curuser[0] in puz[0].likedby.all():
                        puz[0].likedby.remove(curuser[0])
                        puz[0].like=puz[0].like-1
                        puz[0].save(update_fields=['like'])
                        allliked=[]
                        for puzzles in puzzle.objects.all():
                            if curuser[0] in puzzles.likedby.all():
                                allliked.append(puzzles.name)
                        returnlist=[]
                        returnlist.append(allliked)
                        returnlist.append(len(puz[0].likedby.all()))
                        return Response(returnlist,status=status.HTTP_200_OK)
                                        
                    #if the user have not like the puzzle, like it, increase the puzzle's like count
                    else:
                        puz[0].likedby.add(curuser[0])
                        puz[0].like=puz[0].like+1
                        puz[0].save(update_fields=['like'])
                        allliked=[]
                        for puzzles in puzzle.objects.all():
                            if curuser[0] in puzzles.likedby.all():
                                allliked.append(puzzles.name)
                        returnlist=[]
                        returnlist.append(allliked)
                        returnlist.append(len(puz[0].likedby.all()))
                        return Response(returnlist,status=status.HTTP_200_OK)

# get detailed informations about a puzzle
class getdetail(APIView):
    lookup_url_kwarg = 'curpuz'
    def get(self, request, format=None):
        curpuznam = request.GET.get(self.lookup_url_kwarg)
        curpuznam = curpuznam[:len(curpuznam)-1]
        type = request.GET.get(self.lookup_url_kwarg)
        type = type[len(curpuznam)-1:]
        print(curpuznam)
        print(type)
        print(self.lookup_url_kwarg)
        puz=puzzle.objects.filter(name=curpuznam)
        if len(puz)>0:
            if type==3:
                curuserid=request.COOKIES.get('userid', '')
                userinfo=user.objects.filter(userid=curuserid)
                allsave=localsol.objects.filter(user=userinfo[0])
                puzsave=allsave.filter(title=curpuznam)
                returnlist= [puzsave[0].img,puzsave[0].title,puzsave[0].ans]
            else:
                returnlist= [puz[0].img,puz[0].pub_date,puz[0].score,puz[0].like,puz[0].started,puz[0].name,puz[0].describe,puz[0].createdby.username,puz[0].createdby.img,puz[0].ans]
            return Response(returnlist,status=status.HTTP_200_OK)
        
#visit another user
class getvisit(APIView):
    lookup_url_kwarg = 'vname'
    def get(self, request, format=None):
        vusername = request.GET.get(self.lookup_url_kwarg)

        #determine if the visiter is a user or a guest
        curuserid=request.COOKIES.get('userid', '')
        if curuserid=='':
            typevisiter='guest'
        else:
            typevisiter='user'

        #get all relevent information about the visited user
        uservinfo=user.objects.filter(username=vusername)

        #find the puzzles the visited user have completed
        rclist=[]
        for puzzles in uservinfo[0].completed.all():
            rclist.append([puzzles.img,puzzles.pub_date,puzzles.name,puzzles.ans])
        returnlist=[[]]
        if len(rclist)==0:
            returnlist[0].append('none')
        else:
            rclist.sort(key=lambda a: a[1])
            templist=rclist.copy()
            for i in range(len(templist)):
                templist[i].remove(templist[i][1])
            if 20>len(templist):
                returnlist[0].append(templist[0:len(templist)])
            else:
                returnlist[0].append(templist[0:20])        
            returnlist[0].append(len(rclist))
                        
        #find the stats about the visited user like the number of puzzle they completed, the number of puzzle they created, and their score
        allcreatedv=puzzle.objects.filter(createdby=uservinfo[0])
        allcompv=uservinfo[0].completed.all()
        totalscore=0
        for x in allcreatedv:
            totalscore=totalscore+x.score
        for x in allcompv:
            totalscore=totalscore+x.score

        #find lists of puzzles the user have completed, created, and liked to ensure visiting user can not incorrectly access these puzzles
        if typevisiter=='user':
            curuserid=request.COOKIES.get('userid', '')
            userinfo=user.objects.filter(userid=curuserid)
            allcomp=userinfo[0].completed.all()
            allcompname=[]
            for x in allcomp:
                allcompname.append(x.name)
            returnlist.append(allcompname)
            allctitle=[]
            allcreated=puzzle.objects.filter(createdby=userinfo[0])
            for x in allcreated:
                allctitle.append(x.name)
            returnlist.append(allctitle)
            allliked=[]
            for puzzles in puzzle.objects.all():
                if userinfo[0] in puzzles.likedby.all():
                    allliked.append(puzzles.name)
            returnlist.append(allliked)
            returnlist.append("user")
            
        #find lists of puzzles the guest have completed to ensure visiting user can not incorrectly access these puzzles
        else:
            guestname=request.COOKIES.get('identity', '')
            guestinfo=guest.objects.filter(identity=guestname)
            allcomp=guestinfo[0].guestcompleted.all()
            allcompname=[]
            for x in allcomp:
                allcompname.append(x.name)
            returnlist.append(allcompname)
            allctitle=[]
            returnlist.append(allctitle)
            allliked=[]
            returnlist.append(allliked)
            returnlist.append("guest")

        returnlist.insert(0,totalscore)
        returnlist.insert(0,len(allcreatedv))
        returnlist.insert(0,len(allcompv))
        returnlist.insert(0,uservinfo[0].img)
        returnlist.insert(0,uservinfo[0].username)
        return Response(returnlist,status=status.HTTP_200_OK)

#get puzzles to display on the visit page
class visitnewcontent(APIView):
    serializer_class=visitnewcontent
    def post(self, request, format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            order=serializer.data.get('order')
            search=serializer.data.get('search')
            type=serializer.data.get('type')
            page=serializer.data.get('page')
            username=serializer.data.get('name')
            userinfo=user.objects.filter(username=username)
            returnlist=[]

            #display the puzzles visited user created if requested, sort according to sort parameter
            if type==1:
                puzzlescr=puzzle.objects.filter(createdby=userinfo[0])
                templist=[]
                for puzzles in puzzlescr:
                    if search!=None:
                        if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.ans])
                    else:
                        templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.ans])
                if order==0:
                    templist.sort(key=lambda a: a[1])
                if order==1:
                    templist.sort(key=lambda a: a[3])
                if order==2:
                    templist.sort(key=lambda a: a[2])     
                if order==3:
                    templist.sort(key=lambda a: a[4])
                if order==4:
                    templist.sort(key=lambda a: a[1],reverse=True)
                if order==5:
                    templist.sort(key=lambda a: a[3],reverse=True)
                if order==6:
                    templist.sort(key=lambda a: a[2],reverse=True)
                if order==7:
                    templist.sort(key=lambda a: a[4],reverse=True)
                if len(templist)==0:
                    returnlist.append('none')
                    returnlist.append('none')

                else:
                    if page*20+20>len(templist):
                        returnlist.append(templist[page*20:len(templist)])
                    else:
                        returnlist.append(templist[page*20:page*20+20])
                    for i in range(len(returnlist[0])):
                        returnlist[0][i].remove(returnlist[0][i][4])
                        returnlist[0][i].remove(returnlist[0][i][3])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][1])

                    print(len(returnlist[0]))
                    print(len(returnlist[0]))
                    returnlist.append(len(templist))

            #display the puzzles visited user completed if requested, sort according to sort parameter
            else:
                puzzlescomp=userinfo[0].completed.all()
                templist=[]
                for puzzles in puzzlescomp:

                    if search!=None:
                        if search.lower().replace(" ","") in puzzles.name.lower().replace(" ",""):
                            templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.ans])
                    else:
                        templist.append([puzzles.img,puzzles.pub_date,puzzles.score,puzzles.like,puzzles.started,puzzles.name,puzzles.ans])
                if order==0:
                    templist.sort(key=lambda a: a[1])
                if order==1:
                    templist.sort(key=lambda a: a[3])
                if order==2:
                    templist.sort(key=lambda a: a[2])     
                if order==3:
                    templist.sort(key=lambda a: a[4])
                if order==4:
                    templist.sort(key=lambda a: a[1],reverse=True)
                if order==5:
                    templist.sort(key=lambda a: a[3],reverse=True)
                if order==6:
                    templist.sort(key=lambda a: a[2],reverse=True)
                if order==7:
                    templist.sort(key=lambda a: a[4],reverse=True)
                if len(templist)==0:
                    returnlist.append('none')
                    returnlist.append('none')
                else:
                    if page*20+20>len(templist):
                        returnlist.append(templist[page*20:len(templist)])
                    else:
                        returnlist.append(templist[page*20:page*20+20])
                    for i in range(len(returnlist[0])):
                        returnlist[0][i].remove(returnlist[0][i][4])
                        returnlist[0][i].remove(returnlist[0][i][3])
                        returnlist[0][i].remove(returnlist[0][i][2])
                        returnlist[0][i].remove(returnlist[0][i][1])
                    returnlist.append(len(templist))
            return  Response(returnlist,status=status.HTTP_200_OK)
        
#retrive the user's current progress on a saved puzzle they are creating
class getsavepuz(APIView):
    lookup_url_kwarg = 'puzdate'
    def get(self, request, format=None):
        puzdate = request.GET.get(self.lookup_url_kwarg)
        curuserid=request.COOKIES.get('userid', '')
        userinfo=user.objects.filter(userid=curuserid)
        if len(userinfo)>0:
            allpuzsave=localsol.objects.filter(user=userinfo[0])
            targetpuz=allpuzsave.filter(save_first=puzdate)

            if len(targetpuz)>0:
                return Response(targetpuz[0].localans,status=status.HTTP_200_OK)
            else:
                return Response("back",status=status.HTTP_200_OK)


#log a user out
class logout(APIView):
    def post(self, request, format=None):
        response = Response("ok",status=status.HTTP_200_OK)
        response.delete_cookie('userid')
        identity=str(len(guest.objects.filter()))
        newguest=guest (identity=identity)
        allpuz=puzzle.objects.all()
        newguest.save()
        for puz in allpuz:
            newguest.guestnotstarted.add(puz)
        response.set_cookie('identity', identity,max_age=2600000)
        return response

#get the name of every puzzle the user like
class getalllike(APIView):
    def get(self, request, format=None):
        curuserid=request.COOKIES.get('userid', '')
        userinfo=user.objects.filter(userid=curuserid)
        allliked=[]
        if len(userinfo)>0:
            for puzzles in puzzle.objects.all():
                if userinfo[0] in puzzles.likedby.all():
                    allliked.append(puzzles.name)
        return Response(allliked,status=status.HTTP_200_OK)
// Final, bounded atlas expansion: exactly these 30 sequences, 200,000 points each.
// Run from the project root; reference CSV directory is the sole argument.
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <functional>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std; using I=int64_t;
constexpr int BOUND=60000000,TARGET=200000;
vector<int> spf(BOUND+1), primes;
string refs;
void require(bool ok,string msg){if(!ok)throw runtime_error(msg);}
int digits(I n,int base=10){int s=0;for(;n;n/=base)s+=n%base;return s;}
vector<pair<I,int>> factor(I n){vector<pair<I,int>> f;
 if(n>BOUND){for(int p:primes){if(I(p)*p>n)break;if(n%p)continue;int e=0;do{n/=p;e++;}while(n%p==0);f.push_back({p,e});if(n<=BOUND)break;}}
 while(n>1){I p=n<=BOUND?spf[n]:n;int e=0;do{n/=p;e++;}while(n%p==0);f.push_back({p,e});}return f;
}
I weight(I a,I d){if(a<=2*d)return 0;auto f=factor(a-d);vector<I> ds{1};for(auto [p,e]:f){size_t n=ds.size();I power=1;for(int j=0;j<e;j++){power*=p;for(size_t i=0;i<n;i++)ds.push_back(ds[i]*power);}}I k=a-d;for(I v:ds)if(v>d)k=min(k,v);return k;}
I first(string id){ifstream in(refs+"/"+id+".csv");string s;while(getline(in,s)){replace(s.begin(),s.end(),';',',');stringstream ss(s);string n,a;getline(ss,n,',');getline(ss,a,',');if(!n.empty()&&all_of(n.begin(),n.end(),[](char c){return c>='0'&&c<='9';})&&!a.empty())return stoll(a);}throw runtime_error("No reference prefix: "+id);}
void output(string id,I a,function<I(I)> next){string path="raw/"+id+".csv";if(filesystem::exists(path)){ifstream check(path);string line;int points=0;while(getline(check,line)){replace(line.begin(),line.end(),',',' ');istringstream row(line);I n,a,k,L,d;if(row>>n>>a>>k>>L>>d)points+=k>0;}require(points==TARGET,"Incomplete existing dataset: "+path);cout<<id<<" already complete; preserved"<<endl;return;}ofstream out(path);out<<"n,a,k,L,d\n";int count=0,n=1;
 while(count<TARGET){I b=next(a);require(b>a,"Not increasing "+id);I d=b-a,k=weight(a,d),L=k?(a-d)/k:0;require(!k||(k>d&&k*L+d==a),"WLJ identity");out<<n++<<','<<a<<','<<k<<','<<L<<','<<d<<'\n';count+=k>0;a=b;}out.close();require(bool(out),"Write failed");cout<<id<<" "<<count<<" points, successor "<<a<<endl;
}
void matching(string id,function<bool(int)> pred){output(id,first(id),[=](I a)->I{for(int b=int(a)+1;b<=BOUND;b++)if(pred(b))return b;throw runtime_error("Bound exhausted "+id);});}
void fromVector(string id,vector<I> values){sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());I a=first(id);size_t at=lower_bound(values.begin(),values.end(),a)-values.begin();require(at<values.size()&&values[at]==a,"Missing first "+id);output(id,a,[&](I)->I{require(++at<values.size(),"Vector exhausted "+id);return values[at];});}
I sigma(int a){I s=1;for(auto [p,e]:factor(a)){I part=1,power=1;while(e--){power*=p;part+=power;}s*=part;}return s;}
int omega(int a,bool distinct=false){int s=0;for(auto [p,e]:factor(a))s+=distinct?1:e;return s;}
I powmod(I a,I e,I m){I s=1%m;while(e){if(e&1)s=s*a%m;a=a*a%m;e>>=1;}return s;}
I isqrt(I n){I x=sqrt((long double)n);while((x+1)*(x+1)<=n)x++;while(x*x>n)x--;return x;}
int main(int argc,char**argv){require(argc==2,"Provide reference CSV directory");refs=argv[1];filesystem::create_directories("raw");
 for(int i=2;i<=BOUND;i++){if(!spf[i]){spf[i]=i;primes.push_back(i);}for(int p:primes){if(p>spf[i]||I(i)*p>BOUND)break;spf[i*p]=p;}}
 vector<bool> generated(3000001);for(int m=1;m<3000000;m++){int b=m+digits(m,4);if(b<=3000000)generated[b]=true;}
 matching("a010064",[&](int a){require(a<=3000000,"Self bound");return !generated[a];});
 for(auto [id,digit]:vector<pair<string,int>>{{"a011531",1},{"a011539",9},{"a011540",0}})matching(id,[=](int a){do{if(a%10==digit)return true;a/=10;}while(a);return false;});

 vector<I> values;I sum=0;for(int n=1;n<210000;n++){sum+=omega(n,true);values.push_back(sum);}fromVector("a013939",values);
 matching("a014076",[](int a){return a%2&&(a==1||spf[a]!=a);});
 values.clear();values.push_back(0);for(int len=1;values.size()<220000;len++){I low=1;for(int i=1;i<(len+1)/2;i++)low*=3;for(I h=low;h<low*3;h++){I a=h,t=len%2?h/3:h;while(t){a=a*3+t%3;t/=3;}values.push_back(a);}}fromVector("a014190",values);
 for(auto [id,odd]:vector<pair<string,bool>>{{"a014261",true},{"a014263",false}}){values.clear();if(!odd)values.push_back(0);vector<I> layer;for(int d=1;d<=9;d++)if(bool(d%2)==odd)layer.push_back(d);while(values.size()<220000){values.insert(values.end(),layer.begin(),layer.end());vector<I> next;for(I a:layer)for(int d=0;d<=9;d++)if(bool(d%2)==odd)next.push_back(a*10+d);layer=move(next);}fromVector(id,values);}
 matching("a014574",[](int a){return a>3&&a+1<=BOUND&&spf[a-1]==a-1&&spf[a+1]==a+1;});
 for(auto [id,num]:vector<pair<string,int>>{{"a014612",3},{"a014613",4},{"a014614",5}})matching(id,[=](int a){return omega(a)==num;});
 values.clear();for(int n=1;n<210000;n++)values.push_back(I(primes[n-1])+n);fromVector("a014688",values);
 matching("a015911",[](int a){return powmod(2,a,a)%2==1;});
 for(string id:{"a016052","a016096"})output(id,first(id),[](I a){return a+digits(a);});
 constexpr int Q=4000000;vector<bool> positiveSquares(Q+1),twoSquares(Q+1),sevenSquares(Q+1),triangular(Q+1),squareCube(Q+1);
 for(I x=0;x*x<=Q;x++)for(I y=0;x*x+y*y<=Q;y++){twoSquares[x*x+y*y]=true;if(x&&y)positiveSquares[x*x+y*y]=true;}
 for(I x=0;x*x<=Q;x++)for(I y=0;x*x+7*y*y<=Q;y++)sevenSquares[x*x+7*y*y]=true;
 for(I x=0;x*(x+1)/2<=Q;x++)for(I y=0;x*(x+1)/2+y*(y+1)/2<=Q;y++)triangular[x*(x+1)/2+y*(y+1)/2]=true;
 for(I y=0;y*y*y<=Q;y++)for(I x=0;x*x+y*y*y<=Q;x++)squareCube[x*x+y*y*y]=true;
 auto setmatch=[&](string id,const vector<bool>& flags,bool invert){matching(id,[&](int a){require(a<=Q,"Quadratic form bound "+id);return bool(flags[a])!=invert;});};
 setmatch("a018825",positiveSquares,true);
 matching("a019506",[](int a){if(a<4||spf[a]==a)return false;int s=0;for(auto [p,e]:factor(a))s+=digits(p);return s==digits(a);});
 setmatch("a020670",sevenSquares,false);setmatch("a020756",triangular,false);setmatch("a020757",triangular,true);setmatch("a022544",twoSquares,true);setmatch("a022549",squareCube,false);
 values.clear();sum=0;for(int n=1;n<210000;n++){sum+=omega(n);values.push_back(sum);}fromVector("a022559",values);
 values.clear();for(I n=0;n<210000;n++)values.push_back(isqrt(5*n*n));fromVector("a022839",values);
 values.clear();for(I n=0;n<210000;n++)values.push_back(isqrt(7*n*n));fromVector("a022841",values);
 matching("a023197",[](int a){return sigma(a)>=I(a)*3;});
 matching("a023200",[](int a){return a+4<=BOUND&&spf[a]==a&&spf[a+4]==a+4;});
 matching("a023201",[](int a){return a+6<=BOUND&&spf[a]==a&&spf[a+6]==a+6;});
}

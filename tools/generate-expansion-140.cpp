// Twenty-sequence expansion, 200,000 plotted points per sequence.
// Run from the project root; uses fixtures/expansion-140 for source indexing.
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
void output(string id,I a,function<I(I)> next){string path="raw/"+id+".csv";if(filesystem::exists(path)){ifstream check(path);string line;int points=0;while(getline(check,line)){replace(line.begin(),line.end(),',',' ');istringstream row(line);I n,a,k,L,d;if(row>>n>>a>>k>>L>>d)points+=k>0;}require(points==TARGET,"Incomplete existing dataset: "+path);cout<<id<<" already complete; preserved"<<endl;return;}string temp=path+".part";ofstream out(temp);out<<"n,a,k,L,d\n";int count=0,n=1;
 while(count<TARGET){I b=next(a);require(b>a,"Not increasing "+id);I d=b-a,k=weight(a,d),L=k?(a-d)/k:0;require(!k||(k>d&&k*L+d==a),"WLJ identity");out<<n++<<','<<a<<','<<k<<','<<L<<','<<d<<'\n';count+=k>0;a=b;}out.close();require(bool(out),"Write failed");filesystem::rename(temp,path);cout<<id<<" "<<count<<" points, successor "<<a<<endl;
}
void matching(string id,function<bool(int)> pred,int scanBound=BOUND){output(id,first(id),[=](I a)->I{for(int b=int(a)+1;b<=scanBound;b++)if(pred(b))return b;throw runtime_error("Bound exhausted "+id);});}
void fromVector(string id,vector<I> values){sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());I a=first(id);size_t at=lower_bound(values.begin(),values.end(),a)-values.begin();require(at<values.size()&&values[at]==a,"Missing first "+id);output(id,a,[&](I)->I{require(++at<values.size(),"Vector exhausted "+id);return values[at];});}
I sigma(int a){I s=1;for(auto [p,e]:factor(a)){I part=1,power=1;while(e--){power*=p;part+=power;}s*=part;}return s;}
int omega(int a,bool distinct=false){int s=0;for(auto [p,e]:factor(a))s+=distinct?1:e;return s;}
I powmod(I a,I e,I m){I s=1%m;while(e){if(e&1)s=s*a%m;a=a*a%m;e>>=1;}return s;}
I isqrt(I n){I x=sqrt((long double)n);while((x+1)*(x+1)<=n)x++;while(x*x>n)x--;return x;}
bool hasDigit(I a,int base,int digit){do{if(a%base==digit)return true;a/=base;}while(a);return false;}
I reverseDigits(I a,int base){I r=0;do{r=r*base+a%base;a/=base;}while(a);return r;}
int digitCount(I a,int base,int digit){int count=0;do{count+=a%base==digit;a/=base;}while(a);return count;}
int maxDigit(I a){int best=0;do{best=max(best,int(a%10));a/=10;}while(a);return best;}
int main(){
 refs="tools/fixtures/expansion-140";filesystem::create_directories("raw");
 for(int i=2;i<=BOUND;i++){if(!spf[i]){spf[i]=i;primes.push_back(i);}for(int p:primes){if(p>spf[i]||I(i)*p>BOUND)break;spf[i*p]=p;}}
 for(auto [id,base]:vector<pair<string,int>>{{"a014192",4},{"a029952",5},{"a029953",6},{"a029954",7},{"a029803",8},{"a029955",9}}){
  vector<I> values{0};
  for(int len=1;values.size()<230000;len++){
   I low=1;for(int j=1;j<(len+1)/2;j++)low*=base;
   for(I h=low;h<low*base;h++){I a=h,t=len%2?h/base:h;while(t){a=a*base+t%base;t/=base;}values.push_back(a);}
  }
  fromVector(id,values);
 }
 // Enumerate nonzero-digit words directly, in increasing numerical order.
 for(auto [id,base]:vector<pair<string,int>>{{"a032924",3},{"a023705",4}}){
  vector<I> values,layer;for(int d=1;d<base;d++)layer.push_back(d);
  while(values.size()<230000){values.insert(values.end(),layer.begin(),layer.end());vector<I> next;for(I a:layer)for(int d=1;d<base;d++)next.push_back(a*base+d);layer=move(next);}
  fromVector(id,values);
 }
 matching("a023733",[](int a){return !hasDigit(a,5,3);});
 matching("a031443",[](int a){return a>0 && 2*__builtin_popcount(unsigned(a))==32-__builtin_clz(unsigned(a));});
 matching("a037301",[](int a){return digits(a,2)==digits(a,3);});
 matching("a037308",[](int a){return __builtin_popcount(unsigned(a))==digits(a,10);},1000000000);
 matching("a039004",[](int a){return digitCount(a,4,1)==digitCount(a,4,2);});
 matching("a027697",[](int a){return a>1&&spf[a]==a&&__builtin_popcount(unsigned(a))%2==1;});
 matching("a027699",[](int a){return a>1&&spf[a]==a&&__builtin_popcount(unsigned(a))%2==0;});
 matching("a028835",[](int a){int r=1+(a-1)%9;return r==2||r==3||r==5||r==7;});
 matching("a029742",[](int a){return a!=reverseDigits(a,10);});
 matching("a006364",[](int a){return __builtin_popcount(unsigned(a/2))%2==0;});
 output("a045844",first("a045844"),[](I a){return a+maxDigit(a);});
 // Gosper's successor for positive integers with exactly five set bits.
 output("a014313",first("a014313"),[](I a){I c=a&-a,r=a+c;return r|(((r^a)>>2)/c);});
}

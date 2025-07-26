#include <iostream>
#include <vector>
#include <list>
#include <unordered_map>
#include <string>
#include <sstream>
#include <iomanip>
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

struct StepLog {
    int access;
    bool hit;
    vector<int> frameState;
};

class PageReplacementAlgorithm {
protected:
    int numFrames;
    vector<int> frames;
    int hits;
    int misses;
    vector<StepLog> logs;

public:
    PageReplacementAlgorithm(int frameCount) : numFrames(frameCount), hits(0), misses(0) {
        frames.resize(frameCount, -1); // -1 indicates empty frame
    }

    virtual ~PageReplacementAlgorithm() = default;

    virtual void accessPage(int pageNumber) = 0;

    int getHits() const { return hits; }
    int getMisses() const { return misses; }

    void logStep(int pageNumber, bool hit) {
        logs.push_back({pageNumber, hit, frames});
    }

    json getLogsAsJson() const {
        json steps = json::array();
        for (const auto& step : logs) {
            steps.push_back({
                {"access", step.access},
                {"hit", step.hit},
                {"frames", step.frameState}
            });
        }
        return steps;
    }

protected:
    bool isPageInMemory(int pageNumber) const {
        for (int frame : frames) {
            if (frame == pageNumber) return true;
        }
        return false;
    }

    int findEmptyFrame() const {
        for (size_t i = 0; i < frames.size(); ++i) {
            if (frames[i] == -1) return i;
        }
        return -1;
    }
};

class FIFOAlgorithm : public PageReplacementAlgorithm {
private:
    list<int> pageQueue;

public:
    FIFOAlgorithm(int frameCount) : PageReplacementAlgorithm(frameCount) {}

    void accessPage(int pageNumber) override {
        if (isPageInMemory(pageNumber)) {
            hits++;
            logStep(pageNumber, true);
            return;
        }

        misses++;
        int emptyFrame = findEmptyFrame();
        if (emptyFrame != -1) {
            frames[emptyFrame] = pageNumber;
            pageQueue.push_back(pageNumber);
        } else {
            int victimPage = pageQueue.front();
            pageQueue.pop_front();
            for (int& frame : frames) {
                if (frame == victimPage) {
                    frame = pageNumber;
                    break;
                }
            }
            pageQueue.push_back(pageNumber);
        }

        logStep(pageNumber, false);
    }
};

class LRUAlgorithm : public PageReplacementAlgorithm {
private:
    list<int> lruList;
    unordered_map<int, list<int>::iterator> pageMap;

public:
    LRUAlgorithm(int frameCount) : PageReplacementAlgorithm(frameCount) {}

    void accessPage(int pageNumber) override {
        if (isPageInMemory(pageNumber)) {
            hits++;
            lruList.erase(pageMap[pageNumber]);
            lruList.push_front(pageNumber);
            pageMap[pageNumber] = lruList.begin();
            logStep(pageNumber, true);
            return;
        }

        misses++;
        int emptyFrame = findEmptyFrame();
        if (emptyFrame != -1) {
            frames[emptyFrame] = pageNumber;
            lruList.push_front(pageNumber);
            pageMap[pageNumber] = lruList.begin();
        } else {
            int victimPage = lruList.back();
            lruList.pop_back();
            pageMap.erase(victimPage);
            for (int& frame : frames) {
                if (frame == victimPage) {
                    frame = pageNumber;
                    break;
                }
            }
            lruList.push_front(pageNumber);
            pageMap[pageNumber] = lruList.begin();
        }

        logStep(pageNumber, false);
    }
};

class AlgorithmFactory {
public:
    static PageReplacementAlgorithm* createAlgorithm(const string& algorithm, int frameCount) {
        if (algorithm == "FIFO") {
            return new FIFOAlgorithm(frameCount);
        } else if (algorithm == "LRU") {
            return new LRUAlgorithm(frameCount);
        } else {
            throw invalid_argument("Unknown algorithm: " + algorithm);
        }
    }
};

int main() {
    try {
        string algorithm;
        int numFrames;
        string referenceString;

        getline(cin, algorithm);
        cin >> numFrames;
        cin.ignore();
        getline(cin, referenceString);

        vector<int> pages;
        stringstream ss(referenceString);
        int page;
        while (ss >> page) {
            pages.push_back(page);
        }

        PageReplacementAlgorithm* algo = AlgorithmFactory::createAlgorithm(algorithm, numFrames);

        for (int page : pages) {
            algo->accessPage(page);
        }

        json output;
        output["algorithm"] = algorithm;
        output["frames"] = numFrames;
        output["hits"] = algo->getHits();
        output["misses"] = algo->getMisses();
        stringstream rate;
        rate << fixed << setprecision(2)
             << (100.0 * algo->getHits() / (algo->getHits() + algo->getMisses()));
        output["hit_rate"] = rate.str();

        output["steps"] = algo->getLogsAsJson();

        cout << output.dump(4) << endl;

        delete algo;

    } catch (const exception& e) {
        json err;
        err["error"] = e.what();
        cout << err.dump(4) << endl;
        return 1;
    }

    return 0;
}
